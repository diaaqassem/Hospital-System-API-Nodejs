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

/**
 * Middleware to set document ID from parameters
//  */
// exports.setIds =
//   (idParamName = "id", modelName = "") =>
//   (req, res, next) => {
//     if (!req.params[idParamName]) {
//       return next(new AppError(`No ${idParamName} specified`, 400));
//     }

//     req.docId = req.params[idParamName];
//     req.modelName = modelName || idParamName;
//     next();
// };

/**
 * Middleware to verify document ownership
 */
// exports.checkOwnership = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const doc = await Model.findById(req.params.id);

//     if (!doc) {
//       return next(new AppError("No document found with that ID", 404));
//     }

//     // Check if document belongs to user (assuming user reference exists)
//     if (doc.user && doc.user.toString() !== req.user.id) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   });

// // API Features Class (used by getAll handler)
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ["page", "sort", "limit", "fields"];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // Advanced filtering
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));

//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }

//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }

//     return this;
//   }

//   paginate() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }
