const Pharmacy = require("../models/Pharmacy");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const pharmacyService = require("../services/pharmacyService");
const factory = require("./handlerFactory");

exports.getAllPharmacies = factory.getAll(Pharmacy);

exports.getPharmacy = factory.getOne(Pharmacy, "medications");

// before create pharmacy check manager role is pharmacy
exports.createPharmacy = catchAsync(async (req, res, next) => {
  const { manager } = req.body;
  const managerUser = await User.findOne({ _id: manager });
  if (!managerUser) return next(new AppError("Manager not found", 404));
  if (managerUser.role !== "pharmacy")
    return next(new AppError("Manager is not pharmacy", 404));
  const newPharmacy = await Pharmacy.create(req.body);
  res.status(201).json({ newPharmacy });
});
exports.updatePharmacy = factory.updateOne(Pharmacy);

exports.deletePharmacy = factory.deleteOne(Pharmacy);

// exports.getPharmaciesWithin = catchAsync(async (req, res, next) => {
//   const { distance, latlng, unit } = req.params;
//   const pharmacies = await pharmacyService.getPharmacyWithin(
//     distance,
//     latlng,
//     unit
//   );

//   res.status(200).json({
//     status: "success",
//     results: pharmacies.length,
//     data: {
//       pharmacies,
//     },
//   });
// });

// exports.getDistances = catchAsync(async (req, res, next) => {
//   const { latlng, unit } = req.params;
//   const distances = await pharmacyService.getDistances(latlng, unit);

//   res.status(200).json({
//     status: "success",
//     data: {
//       distances,
//     },
//   });
// });
