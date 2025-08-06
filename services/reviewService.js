const Review = require("../models/Review");
const AppError = require("../utils/appError");

exports.createReview = async (data) => {
  // Check if review already exists for this patient and entity
  let existingReview;
  if (data.doctor) {
    existingReview = await Review.findOne({
      patient: data.patient,
      doctor: data.doctor,
    });
  } else if (data.nurse) {
    existingReview = await Review.findOne({
      patient: data.patient,
      nurse: data.nurse,
    });
  } else if (data.clinic) {
    existingReview = await Review.findOne({
      patient: data.patient,
      clinic: data.clinic,
    });
  }

  if (existingReview) {
    throw new AppError(
      "You have already submitted a review for this entity",
      400
    );
  }

  return await Review.create(data);
};


exports.getEntityReviews = async (entityType, entityId) => {
  let query = {};
  if (entityType === "doctor") {
    query.doctor = entityId;
  } else if (entityType === "nurse") {
    query.nurse = entityId;
  } else if (entityType === "clinic") {
    query.clinic = entityId;
  } else {
    throw new AppError("Invalid entity type", 400);
  }

  return await Review.find(query).populate({
    path: "patient",
    select: "user",
    populate: {
      path: "user",
      select: "name profileImage",
    },
  });
};
