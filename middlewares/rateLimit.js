const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many login attempts from this IP, please try again later",
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests from this IP, please try again later",
        429
      )
    );
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests from this IP, please try again later",
        429
      )
    );
  },
});

const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many sensitive actions from this IP, please try again later",
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many sensitive actions from this IP, please try again later",
        429
      )
    );
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
  sensitiveActionLimiter,
};
