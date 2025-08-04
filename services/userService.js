// const User = require("../models/User");
// const AppError = require("../utils/appError");
// const APIFeatures = require("../utils/apiFeatures");

// // User CRUD Operations
// exports.getAllUsers = async (query) => {
//   const features = new APIFeatures(User.find(), query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   return await features.query;
// };

// exports.getUser = async (id) => {
//   return await User.findById(id);
// };

// exports.createUser = async (data) => {
//   return await User.create(data);
// };

// exports.updateUser = async (id, data) => {
//   return await User.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true,
//   });
// };

// exports.deleteUser = async (id) => {
//   return await User.findByIdAndDelete(id);
// };

// // Profile-specific Operations
// exports.getMe = async (userId) => {
//   return await User.findById(userId).select("+active");
// };

// exports.updateMe = async (userId, data) => {
//   return await User.findByIdAndUpdate(userId, data, {
//     new: true,
//     runValidators: true,
//   });
// };

// exports.deleteMe = async (userId) => {
//   return await User.findByIdAndUpdate(userId, { active: false }, { new: true });
// };
