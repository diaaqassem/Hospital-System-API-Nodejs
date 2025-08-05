const catchAsync = require("../utils/catchAsync");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const AppError = require("../utils/appError");
const appointmentService = require("../services/appointmentService");
const factory = require("./handlerFactory");

exports.getAllAppointments = factory.getAll(Appointment);

exports.getAppointment = factory.getOne(Appointment);

exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await appointmentService.createAppointment(req.body);

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});

exports.updateAppointment = factory.updateOne(Appointment);

exports.deleteAppointment = factory.deleteOne(Appointment);

exports.getMyAppointments = catchAsync(async (req, res, next) => {
  let appointments;
  if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user.id });
    appointments = await appointmentService.getDoctorAppointments(doctor._id);
  } else if (req.user.role === "patient") {
    const patient = await Patient.findOne({ user: req.user.id });
    appointments = await appointmentService.getPatientAppointments(patient._id);
  } else {
    return next(
      new AppError("You are not authorized to view appointments", 403)
    );
  }

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});
