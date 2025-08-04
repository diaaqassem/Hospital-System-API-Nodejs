const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const logger = require("../utils/logger");

/**
 * Applies security middleware to the Express application
 * @param {express.Application} app - Express application instance
 */
exports.applySecurityMiddleware = (app) => {
  // 1. Set security HTTP headers
  app.use(helmet());

  // 2. Enable CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    })
  );

  // 3. Rate limiting
  const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
  });
  app.use("/api", limiter);

  // 4. Body parser middleware
  app.use(express.json({ limit: process.env.BODY_LIMIT || "10kb" }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: process.env.BODY_LIMIT || "10kb",
    })
  );

  // 5. Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // 6. Data sanitization against XSS
  app.use(xss());

  // 7. Prevent parameter pollution
  app.use(
    hpp({
      whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price",
      ],
    })
  );

  logger.info("Security middleware applied successfully");
};

/**
 * Error handler for security-related issues
 */
exports.securityErrorHandler = (err, req, res, next) => {
  logger.error("Security error:", err);

  if (err instanceof rateLimit.RateLimitExceeded) {
    return res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later",
    });
  }

  if (err instanceof mongoSanitize.BlockedQuery) {
    return res.status(400).json({
      status: "fail",
      message: "Potential NoSQL injection detected",
    });
  }

  next(err);
};
