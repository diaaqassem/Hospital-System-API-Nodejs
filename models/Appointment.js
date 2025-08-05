const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Appointment must belong to a patient"],
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: [true, "Appointment must belong to a doctor"],
    },
    clinic: {
      type: mongoose.Schema.ObjectId,
      ref: "Clinic",
    },
    date: {
      type: Date,
      required: [true, "Appointment must have a date"],
    },
    time: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },
    notes: String,
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
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

appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "user",
    populate: {
      path: "user",
      select: "name",
    },
  })
    .populate({
      path: "doctor",
      select: "user specialty",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate({
      path: "clinic",
      select: "name price",
    });
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
