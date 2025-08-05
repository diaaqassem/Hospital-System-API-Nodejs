const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Doctor must belong to a user"],
    },
    specialty: {
      type: String,
      required: [true, "Doctor must have a specialty"],
    },
    qualifications: [String],
    experience: {
      type: Number,
      required: [true, "Doctor must have experience years"],
    },
    bio: String,
    availableHours: {
      start: String,
      end: String,
    },
    consultationFee: {
      type: Number,
      required: [true, "Doctor must have a consultation fee"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    languages: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "doctor",
  localField: "_id",
});

doctorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage email",
  });
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
