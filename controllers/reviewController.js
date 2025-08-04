const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const reviewService = require("../services/reviewService");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getAllReviews(req.query);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.getReview(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.patient) req.body.patient = req.user.id;
  if (!req.body.doctor && req.params.doctorId)
    req.body.doctor = req.params.doctorId;
  if (!req.body.nurse && req.params.nurseId)
    req.body.nurse = req.params.nurseId;
  if (!req.body.clinic && req.params.clinicId)
    req.body.clinic = req.params.clinicId;

  const newReview = await reviewService.createReview(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.updateReview(req.params.id, req.body);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await reviewService.deleteReview(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getEntityReviews = catchAsync(async (req, res, next) => {
  const { entityType, entityId } = req.params;
  const reviews = await reviewService.getEntityReviews(entityType, entityId);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
