const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const AppError = require("../utils/appError");
const { sendEmail } = require("../utils/email");

exports.createAppointment = async (data) => {
  // Check if doctor is available at that time
  const existingAppointment = await Appointment.findOne({
    doctor: data.doctor,
    date: data.date,
    time: data.time,
  });

  if (existingAppointment) {
    throw new AppError("Doctor is not available at that time", 400);
  }

  const appointment = await Appointment.create(data);

  // Send confirmation email
  const patient = await Patient.findById(data.patient).populate("user");
  const doctor = await Doctor.findById(data.doctor).populate("user");

  if (process.env.NODE_ENV === "production") {
    await sendEmail({
      email: patient.user.email,
      subject: "Appointment Confirmation",
      message: `Your appointment with Dr. ${doctor.user.name} on ${data.date} at ${data.time} has been confirmed.`,
    });
  }

  return appointment;
};

exports.getDoctorAppointments = async (doctorId) => {
  return await Appointment.find({ doctor: doctorId })
    .populate("patient")
    .sort({ date: 1, time: 1 });
};

exports.getPatientAppointments = async (patientId) => {
  return await Appointment.find({ patient: patientId })
    .populate("doctor")
    .sort({ date: -1 });
};
