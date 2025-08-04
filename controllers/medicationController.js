const Medication = require("../models/Medication");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllMedications = factory.getAll(Medication);
exports.getMedication = factory.getOne(Medication);
exports.createMedication = factory.createOne(Medication);
exports.updateMedication = factory.updateOne(Medication);
exports.deleteMedication = factory.deleteOne(Medication);

exports.getMedicationsByPharmacy = catchAsync(async (req, res, next) => {
  const medications = await Medication.find({
    pharmacy: req.params.pharmacyId,
  });

  res.status(200).json({
    status: "success",
    results: medications.length,
    data: {
      medications,
    },
  });
});

exports.searchMedications = catchAsync(async (req, res, next) => {
  const medications = await Medication.find({
    name: { $regex: req.params.name, $options: "i" },
  });

  res.status(200).json({
    status: "success",
    results: medications.length,
    data: {
      medications,
    },
  });
});
