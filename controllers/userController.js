// const User = require("../models/User");
// const Patient = require("../models/Patient");
// const Doctor = require("../models/Doctor");
// const Nurse = require("../models/Nurse");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const factory = require("./handlerFactory");
// const logger = require("../utils/logger");

// /**
//  * @desc    Get all users
//  * @route   GET /api/v1/users
//  * @access  Private/Admin
//  */
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find().select("-password -passwordChangedAt");

//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// /**
//  * @desc    Get single user
//  * @route   GET /api/v1/users/:id
//  * @access  Private/Admin
//  */
// exports.getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id).select(
//     "-password -passwordChangedAt"
//   );

//   if (!user) {
//     return next(new AppError("No user found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });

// /**
//  * @desc    Create user (admin only)
//  * @route   POST /api/v1/users
//  * @access  Private/Admin
//  */
// exports.createUser = catchAsync(async (req, res, next) => {
//   const { name, email, password, passwordConfirm, role } = req.body;

//   // 1) Check if email already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return next(new AppError("Email already in use", 400));
//   }

//   // 2) Create new user
//   const newUser = await User.create({
//     name,
//     email,
//     password,
//     passwordConfirm,
//     role: role || "patient",
//   });

//   // 3) Remove sensitive data from output
//   newUser.password = undefined;
//   newUser.passwordChangedAt = undefined;

//   logger.info(`New user created by admin: ${newUser.email}`);

//   res.status(201).json({
//     status: "success",
//     data: {
//       user: newUser,
//     },
//   });
// });

// /**
//  * @desc    Update user
//  * @route   PATCH /api/v1/users/:id
//  * @access  Private/Admin
//  */
// exports.updateUser = catchAsync(async (req, res, next) => {
//   // 1) Filter out unwanted fields that shouldn't be updated
//   const filteredBody = filterObj(req.body, "name", "email", "role", "isActive");

//   // 2) Update user document
//   const updatedUser = await User.findByIdAndUpdate(
//     req.params.id,
//     filteredBody,
//     {
//       new: true,
//       runValidators: true,
//     }
//   ).select("-password -passwordChangedAt");

//   if (!updatedUser) {
//     return next(new AppError("No user found with that ID", 404));
//   }

//   logger.info(`User updated by admin: ${updatedUser.email}`);

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// /**
//  * @desc    Delete user
//  * @route   DELETE /api/v1/users/:id
//  * @access  Private/Admin
//  */
// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndDelete(req.params.id);

//   if (!user) {
//     return next(new AppError("No user found with that ID", 404));
//   }

//   logger.info(`User deleted by admin: ${user.email}`);

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// /**
//  * @desc    Get current user profile
//  * @route   GET /api/v1/users/me
//  * @access  Private
//  */
// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

// /**
//  * @desc    Update current user profile
//  * @route   PATCH /api/v1/users/updateMe
//  * @access  Private
//  */
// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates. Please use /updateMyPassword.",
//         400
//       )
//     );
//   }

//   // 2) Filter out unwanted fields that shouldn't be updated
//   const filteredBody = filterObj(req.body, "name", "email");

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   }).select("-password -passwordChangedAt");

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// /**
//  * @desc    Deactivate current user account
//  * @route   DELETE /api/v1/users/deleteMe
//  * @access  Private
//  */
// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { isActive: false });

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// // Helper function to filter object fields
// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// Helper function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filter out unwanted fields that shouldn't be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Admin-only operations
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// const User = require("../models/User");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const factory = require("./handlerFactory");
// const userService = require("../services/userService"); // Import the service

// // Helper function to filter object fields (move this to utils if reused)
// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

// // Middleware to set current user ID
// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

// // User Profile Operations
// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Check for password update attempt
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates. Please use /updateMyPassword.",
//         400
//       )
//     );
//   }

//   // 2) Filter allowed fields
//   const filteredBody = filterObj(req.body, "name", "email");

//   // 3) Delegate to service
//   const updatedUser = await userService.updateMe(req.user.id, filteredBody);

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// exports.deleteMe = catchAsync(async (req, res, next) => {
//   await userService.deleteMe(req.user.id);

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

// // Admin Operations (using factory pattern)
// exports.getAllUsers = factory.getAll(User);
// exports.getUser = factory.getOne(User);
// exports.createUser = factory.createOne(User);
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
