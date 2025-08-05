const mongoose = require("mongoose");
const { string } = require("yargs");

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A pharmacy must have a name"],
      unique: true,
    },
    location: String,
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Pharmacy must have a manager"],
    },
    contactNumber: String,
    operatingHours: {
      open: String,
      close: String,
    },
    medicationsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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

pharmacySchema.virtual("medications", {
  ref: "Medication",
  foreignField: "pharmacy",
  localField: "_id",
});

pharmacySchema.pre(/^find/, function (next) {
  this.populate({
    path: "manager",
    select: "name email",
  });
  next();
});

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
module.exports = Pharmacy;
