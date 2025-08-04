const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const appointmentService = require("../services/appointmentService");

exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await appointmentService.getAllAppointments(req.query);

  res.status(200).json({
    status: "success",
    results: appointments.length,
    data: {
      appointments,
    },
  });
});

exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.getAppointment(req.params.id);

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  });
});

exports.createAppointment = catchAsync(async (req, res, next) => {
  const newAppointment = await appointmentService.createAppointment(req.body);

  res.status(201).json({
    status: "success",
    data: {
      appointment: newAppointment,
    },
  });
});

exports.updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.updateAppointment(
    req.params.id,
    req.body
  );

  if (!appointment) {
    return next(new AppError("No appointment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      appointment,
    },
  });
});

exports.deleteAppointment = catchAsync(async (req, res, next) => {
  await appointmentService.deleteAppointment(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
