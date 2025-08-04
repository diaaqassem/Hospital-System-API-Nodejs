const Patient = require("../models/Patient");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllPatients = factory.getAll(Patient);
exports.getPatient = factory.getOne(Patient, {
  path: "medicalHistory appointments",
});
exports.createPatient = factory.createOne(Patient);
exports.updatePatient = factory.updateOne(Patient);
exports.deletePatient = factory.deleteOne(Patient);

exports.getPatientsByDoctor = catchAsync(async (req, res, next) => {
  const patients = await Patient.find({ primaryDoctor: req.params.doctorId });

  res.status(200).json({
    status: "success",
    results: patients.length,
    data: {
      patients,
    },
  });
});

exports.getPatientsByNurse = catchAsync(async (req, res, next) => {
  const patients = await Patient.find({ assignedNurse: req.params.nurseId });

  res.status(200).json({
    status: "success",
    results: patients.length,
    data: {
      patients,
    },
  });
});
