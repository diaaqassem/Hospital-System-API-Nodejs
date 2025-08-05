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
      enum: ["general", "private", "operation", "emergency"],
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
    costPerDay: {
      type: Number,
      required: [true, "Room must have a daily cost"],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
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

roomSchema.pre(/^find/, function (next) {
  this.populate({
    path: "assignedNurse",
    select: "user",
    populate: {
      path: "user",
      select: "name",
    },
  });
  next();
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
