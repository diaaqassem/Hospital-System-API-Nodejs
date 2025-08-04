const Nurse = require("../models/Nurse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllNurses = factory.getAll(Nurse);
exports.getNurse = factory.getOne(Nurse, { path: "assignedPatients" });
exports.createNurse = factory.createOne(Nurse);
exports.updateNurse = factory.updateOne(Nurse);
exports.deleteNurse = factory.deleteOne(Nurse);

exports.getAvailableNurses = catchAsync(async (req, res, next) => {
  const date = new Date(req.params.date);
  const nurses = await Nurse.find({
    availableDates: { $gte: date },
    isAvailable: true,
  });

  res.status(200).json({
    status: "success",
    results: nurses.length,
    data: {
      nurses,
    },
  });
});
