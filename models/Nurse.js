const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Nurse must belong to a user"],
    },
    specialization: [String],
    yearsOfExperience: Number,
    department: String,
    shift: {
      type: String,
      enum: ["morning", "evening", "night", "rotating"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nurseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "nurse",
  localField: "_id",
});

nurseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage email",
  });
  next();
});

const Nurse = mongoose.model("Nurse", nurseSchema);
module.exports = Nurse;
