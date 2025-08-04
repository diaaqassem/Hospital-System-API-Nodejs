const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room must have a number"],
      unique: true,
    },
    roomType: {
      type: String,
      enum: ["general", "private", "icu", "operation", "emergency"],
      required: [true, "Room must have a type"],
    },
    floor: {
      type: Number,
      required: [true, "Room must have a floor number"],
    },
    capacity: {
      type: Number,
      required: [true, "Room must have a capacity"],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    costPerDay: {
      type: Number,
      required: [true, "Room must have a daily cost"],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    facilities: [String],
    isAc: {
      type: Boolean,
      default: false,
    },
    assignedNurse: {
      type: mongoose.Schema.ObjectId,
      ref: "Nurse",
    },
    lastCleaned: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roomSchema.pre("save", function (next) {
  if (this.currentOccupancy > this.capacity) {
    throw new Error("Occupancy cannot exceed room capacity");
  }
  next();
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
