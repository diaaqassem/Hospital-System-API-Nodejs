const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const billingService = require("../services/billingService");

exports.getAllBills = catchAsync(async (req, res, next) => {
  const bills = await billingService.getAllBills(req.query);

  res.status(200).json({
    status: "success",
    results: bills.length,
    data: {
      bills,
    },
  });
});

exports.getBill = catchAsync(async (req, res, next) => {
  const bill = await billingService.getBill(req.params.id);

  if (!bill) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
});

exports.createBill = catchAsync(async (req, res, next) => {
  const newBill = await billingService.createBill(req.body);

  res.status(201).json({
    status: "success",
    data: {
      bill: newBill,
    },
  });
});

exports.updateBill = catchAsync(async (req, res, next) => {
  const bill = await billingService.updateBill(req.params.id, req.body);

  if (!bill) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
});

exports.deleteBill = catchAsync(async (req, res, next) => {
  await billingService.deleteBill(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.makePayment = catchAsync(async (req, res, next) => {
  const bill = await billingService.makePayment(
    req.params.id,
    req.body.amount,
    req.body.method
  );

  res.status(200).json({
    status: "success",
    data: {
      bill,
    },
  });
});

exports.getMyBills = catchAsync(async (req, res, next) => {
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return next(new AppError("No patient found for this user", 404));
  }

  const bills = await billingService.getPatientBills(patient._id);

  res.status(200).json({
    status: "success",
    results: bills.length,
    data: {
      bills,
    },
  });
});
