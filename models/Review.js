const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Review must belong to a patient"],
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
    },
    nurse: {
      type: mongoose.Schema.ObjectId,
      ref: "Nurse",
    },
    clinic: {
      type: mongoose.Schema.ObjectId,
      ref: "Clinic",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });
reviewSchema.index({ patient: 1, nurse: 1 }, { unique: true });
reviewSchema.index({ patient: 1, clinic: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "user",
    populate: {
      path: "user",
      select: "name profileImage",
    },
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (
  doctorId,
  nurseId,
  clinicId
) {
  let stats;

  if (doctorId) {
    stats = await this.aggregate([
      {
        $match: { doctor: doctorId },
      },
      {
        $group: {
          _id: "$doctor",
          nRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(doctorId, {
        ratingsQuantity: stats[0].nRating,
        rating: stats[0].avgRating,
      });
    } else {
      await Doctor.findByIdAndUpdate(doctorId, {
        ratingsQuantity: 0,
        rating: 4.5,
      });
    }
  } else if (nurseId) {
    stats = await this.aggregate([
      {
        $match: { nurse: nurseId },
      },
      {
        $group: {
          _id: "$nurse",
          nRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    if (stats.length > 0) {
      await Nurse.findByIdAndUpdate(nurseId, {
        ratingsQuantity: stats[0].nRating,
        rating: stats[0].avgRating,
      });
    } else {
      await Nurse.findByIdAndUpdate(nurseId, {
        ratingsQuantity: 0,
        rating: 4.5,
      });
    }
  } else if (clinicId) {
    // Similar implementation for clinics
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor, this.nurse, this.clinic);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
