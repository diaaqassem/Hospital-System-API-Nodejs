// const AppError = require("../utils/appError");

// exports.restrictToPatient = (req, res, next) => {
//   if (req.user.role !== "patient") {
//     return next(
//       new AppError("You do not have permission to perform this action", 403)
//     );
//   }
//   next();
// };

// exports.restrictToDoctor = (req, res, next) => {
//   if (req.user.role !== "doctor") {
//     return next(
//       new AppError("You do not have permission to perform this action", 403)
//     );
//   }
//   next();
// };

// exports.restrictToPharmacy = (req, res, next) => {
//   if (req.user.role !== "pharmacy") {
//     return next(
//       new AppError("You do not have permission to perform this action", 403)
//     );
//   }
//   next();
// };

// exports.checkOwnership = (model) => {
//   return async (req, res, next) => {
//     const doc = await model.findById(req.params.id);

//     if (!doc) {
//       return next(new AppError("No document found with that ID", 404));
//     }

//     if (doc.user && doc.user.toString() !== req.user.id) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   };
// };
