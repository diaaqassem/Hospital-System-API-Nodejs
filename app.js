const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const { applySecurityMiddleware } = require("./middlewares/security");
const globalErrorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./docs/swaggerDef");

// Import routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const patientRouter = require("./routes/patientRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const pharmacyRouter = require("./routes/pharmacyRoutes");
const medicationRouter = require("./routes/medicationRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const roomRouter = require("./routes/roomRoutes");
const billingRouter = require("./routes/billingRoutes");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Apply security middleware
applySecurityMiddleware(app);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/pharmacies", pharmacyRouter);
app.use("/api/v1/medications", medicationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/bills", billingRouter);

// Handle 404
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
