const catchAsync = require("../utils/catchAsync");
const reviewService = require("../services/reviewService");
const factory = require("./handlerFactory");
const Review = require("../models/Review");

exports.getAllReviews =factory.getAll(Review)

exports.getReview = factory.getOne(Review)

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

exports.updateReview = factory.updateOne(Review)

exports.deleteReview = factory.deleteOne(Review)

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
