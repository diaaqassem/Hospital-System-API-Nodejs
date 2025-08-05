const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient must belong to a user"],
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  height: Number,
  weight: Number,
  medications: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  assignedNurse: {
    type: mongoose.Schema.ObjectId,
    ref: "Nurse",
  },
  primaryDoctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
  },
  lastVisit: Date,
  nextAppointment: Date,
});

patientSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage email",
  })
    .populate({
      path: "primaryDoctor",
      select: "user specialty",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .populate({
      path: "assignedNurse",
      select: "user",
      populate: {
        path: "user",
        select: "name",
      },
    });
  next();
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
