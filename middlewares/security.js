const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

exports.applySecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors());
  app.options("*", cors());

  // Limit requests from same API
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: "Too many requests from this IP, please try again in 15 minutes",
    })
  );

  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
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
};
