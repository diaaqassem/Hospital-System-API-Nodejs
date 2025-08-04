const Doctor = require("../models/Doctor");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const doctorService = require("../services/doctorService");

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await doctorService.getAllDoctors(req.query);

  res.status(200).json({
    status: "success",
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

exports.getDoctor = catchAsync(async (req, res, next) => {
  const doctor = await doctorService.getDoctor(req.params.id);

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.createDoctor = catchAsync(async (req, res, next) => {
  const newDoctor = await doctorService.createDoctor(req.body.user, req.body);

  res.status(201).json({
    status: "success",
    data: {
      doctor: newDoctor,
    },
  });
});

exports.updateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

exports.deleteDoctor = catchAsync(async (req, res, next) => {
  const doctor = await doctorService.deleteDoctor(req.params.id);

  if (!doctor) {
    return next(new AppError("No doctor found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getDoctorStats = catchAsync(async (req, res, next) => {
  const stats = await doctorService.getDoctorStats();

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
