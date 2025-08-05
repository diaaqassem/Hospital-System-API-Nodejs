const Patient = require("../models/Patient");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllPatients = factory.getAll(Patient);

exports.getPatient = factory.getOne(Patient);

exports.createPatient = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const isPatient = await User.findOne({ _id: userId });
  const isFound = await Patient.findOne({ user: userId });
  console.log(isPatient);
  console.log(userId);
  if (isFound) {
    return res.status(404).json({
      status: "fail",
      message: "Patient is in DB",
    });
  }
  if (isPatient.role != "patient") {
    return res.status(400).json({ message: "User is npt a Patient" });
  }
  const newPatient = await new Patient({
    user: userId,
    ...req.body,
  });
  await newPatient.save();

  res.status(201).json({
    status: "success",
    data: {
      Patient: newPatient,
    },
  });
});

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
  const patients = await Patient.find({
    assignedNurse: req.params.nurseId,
  });

  res.status(200).json({
    status: "success",
    results: patients.length,
    data: {
      patients,
    },
  });
});
