const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/logger");

/**
  factory for handling delete operations
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let id;
    if (req.params.id) {
      id = req.params.id;
    } else if (req.user._id) {
      id = req.user._id;
    }
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    logger.info(`${Model.modelName} deleted`, {
      id: req.params.id,
      user: req.user?.id,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

/**
  factory for handling update operations
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    logger.info(`${Model.modelName} updated`, {
      id: req.params.id,
      user: req.user?.id,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
  factory for handling create operations
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    logger.info(`${Model.modelName} created`, {
      id: doc.id,
      user: req.user?.id,
    });

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
  factory for handling get operations (single document)
 */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
  factory for handling get all operations
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
