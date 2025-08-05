const Doctor = require("../models/Doctor");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const doctorService = require("../services/doctorService");
const factory = require("./handlerFactory");

exports.getAllDoctors = factory.getAll(Doctor);

exports.getDoctor = factory.getOne(Doctor, [
  {
    path: "User",
  },
  {
    path: "Review",
  },
]);

exports.createDoctor = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const isDoctor = await User.findOne({ _id: userId });
  const isFound = await Doctor.findOne({ user: userId });
  console.log(isDoctor);
  if (isFound) {
    return res.status(404).json({
      status: "fail",
      message: "Doctor is in Db",
    });
  }
  if (isDoctor.role != "doctor") {
    return res.status(400).json({ message: "User is npt a doctor" });
  }
  const newDoctor = await new Doctor({
    user: userId,
    ...req.body,
  });
  await newDoctor.save();

  res.status(201).json({
    status: "success",
    data: {
      doctor: newDoctor,
    },
  });
});

exports.updateDoctor = factory.updateOne(Doctor);

exports.deleteDoctor = factory.deleteOne(Doctor);

exports.getDoctorStats = catchAsync(async (req, res, next) => {
  const stats = await doctorService.getDoctorStats();

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
