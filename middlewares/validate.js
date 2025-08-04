const Joi = require("joi");
const AppError = require("../utils/appError");

exports.validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string().valid(
      "patient",
      "doctor",
      "manager",
      "pharmacy",
      "nurse"
    ),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

exports.validateAppointment = (req, res, next) => {
  const schema = Joi.object({
    patient: Joi.string().required(),
    doctor: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    reason: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

exports.validateMedication = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    pharmacy: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};
