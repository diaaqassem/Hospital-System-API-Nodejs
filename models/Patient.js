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
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  insuranceProvider: String,
  insuranceId: String,
  primaryCarePhysician: {
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
  }).populate({
    path: "primaryCarePhysician",
    select: "user specialty",
    populate: {
      path: "user",
      select: "name",
    },
  });
  next();
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
