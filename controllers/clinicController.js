const Clinic = require("../models/Clinic");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllClinics = factory.getAll(Clinic);
exports.getClinic = factory.getOne(Clinic, { path: "appointments" });
exports.createClinic = factory.createOne(Clinic);
exports.updateClinic = factory.updateOne(Clinic);
exports.deleteClinic = factory.deleteOne(Clinic);

exports.getClinicsByDoctor = catchAsync(async (req, res, next) => {
  const clinics = await Clinic.find({ doctorID: req.params.doctorId });

  res.status(200).json({
    status: "success",
    results: clinics.length,
    data: {
      clinics,
    },
  });
});

exports.getAvailableClinics = catchAsync(async (req, res, next) => {
  const date = new Date(req.params.date);
  const clinics = await Clinic.find({
    date: { $gte: date },
    availableSlots: { $gt: 0 },
  });

  res.status(200).json({
    status: "success",
    results: clinics.length,
    data: {
      clinics,
    },
  });
});
