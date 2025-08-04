const User = require("../models/User");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllUsers = async (query) => {
  const features = new APIFeatures(User.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.getUser = async (id) => {
  return await User.findById(id);
};

exports.createUser = async (data) => {
  return await User.create(data);
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.getMe = async (userId) => {
  return await User.findById(userId);
};

exports.updateMe = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      name: data.name,
      email: data.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return user;
};

exports.deleteMe = async (userId) => {
  await User.findByIdAndUpdate(userId, { active: false });
};
