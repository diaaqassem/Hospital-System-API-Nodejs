const Nurse = require("../models/Nurse");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllNurses = factory.getAll(Nurse);
// ------------------------------------------ update That
exports.getNurse = factory.getOne(Nurse, { path: "assignedPatients" });
exports.updateNurse = factory.updateOne(Nurse);
exports.deleteNurse = factory.deleteOne(Nurse);

exports.getNurse = factory.getOne(Nurse, [
  {
    path: "User",
  },
  {
    path: "Review",
  },
]);

exports.createNurse = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const isNurse = await User.findOne({ _id: userId });
  const isFound = await Nurse.findOne({ user: userId });
  console.log(isNurse);
  console.log(userId);
  if (isFound) {
    return res.status(404).json({
      status: "fail",
      message: "Nurse is in DB",
    });
  }
  if (isNurse.role != "nurse") {
    return res.status(400).json({ message: "User is npt a Nurse" });
  }
  const newNurse = await new Nurse({
    user: userId,
    ...req.body,
  });
  await newNurse.save();

  res.status(201).json({
    status: "success",
    data: {
      Nurse: newNurse,
    },
  });
});

exports.getAvailableNurses = catchAsync(async (req, res, next) => {
  const nurses = await Nurse.find({
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
