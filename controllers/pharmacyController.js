const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const pharmacyService = require("../services/pharmacyService");

exports.getAllPharmacies = catchAsync(async (req, res, next) => {
  const pharmacies = await pharmacyService.getAllPharmacies(req.query);

  res.status(200).json({
    status: "success",
    results: pharmacies.length,
    data: {
      pharmacies,
    },
  });
});

exports.getPharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await pharmacyService.getPharmacy(req.params.id);

  if (!pharmacy) {
    return next(new AppError("No pharmacy found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      pharmacy,
    },
  });
});

exports.createPharmacy = catchAsync(async (req, res, next) => {
  const newPharmacy = await pharmacyService.createPharmacy(req.body);

  res.status(201).json({
    status: "success",
    data: {
      pharmacy: newPharmacy,
    },
  });
});

exports.updatePharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await pharmacyService.updatePharmacy(
    req.params.id,
    req.body
  );

  if (!pharmacy) {
    return next(new AppError("No pharmacy found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      pharmacy,
    },
  });
});

exports.deletePharmacy = catchAsync(async (req, res, next) => {
  await pharmacyService.deletePharmacy(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getPharmaciesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const pharmacies = await pharmacyService.getPharmacyWithin(
    distance,
    latlng,
    unit
  );

  res.status(200).json({
    status: "success",
    results: pharmacies.length,
    data: {
      pharmacies,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const distances = await pharmacyService.getDistances(latlng, unit);

  res.status(200).json({
    status: "success",
    data: {
      distances,
    },
  });
});
