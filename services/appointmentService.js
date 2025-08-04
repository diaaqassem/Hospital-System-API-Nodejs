const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const { sendEmail } = require("../utils/email");

exports.getAllAppointments = async (query) => {
  const features = new APIFeatures(Appointment.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.getAppointment = async (id) => {
  return await Appointment.findById(id);
};

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

exports.updateAppointment = async (id, data) => {
  return await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
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
