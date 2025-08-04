const Doctor = require("../models/Doctor");
const User = require("../models/User");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllDoctors = async (query) => {
  const features = new APIFeatures(Doctor.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.getDoctor = async (id) => {
  return await Doctor.findById(id);
};

exports.createDoctor = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("No user found with that ID", 404);
  if (user.role !== "doctor") throw new AppError("User is not a doctor", 400);

  const doctorData = {
    user: userId,
    ...data,
  };

  return await Doctor.create(doctorData);
};

exports.updateDoctor = async (id, data) => {
  return await Doctor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteDoctor = async (id) => {
  return await Doctor.findByIdAndDelete(id);
};

exports.getDoctorStats = async () => {
  return await Doctor.aggregate([
    {
      $match: { rating: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$specialty",
        numDoctors: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        avgFee: { $avg: "$consultationFee" },
        minFee: { $min: "$consultationFee" },
        maxFee: { $max: "$consultationFee" },
      },
    },
    {
      $sort: { avgRating: -1 },
    },
  ]);
};
