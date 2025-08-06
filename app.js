const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const { applySecurityMiddleware } = require("./middlewares/security");
const globalErrorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");

// Import routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const clinicRouter = require("./routes/clinicRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const nurseRouter = require("./routes/nurseRoutes");
const patientRouter = require("./routes/patientRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const pharmacyRouter = require("./routes/pharmacyRoutes");
const medicationRouter = require("./routes/medicationRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const roomRouter = require("./routes/roomRoutes");
// const billingRouter = require("./routes/billingRoutes");
const logger = require("./utils/logger");

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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/clinics", clinicRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/nurses", nurseRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/pharmacies", pharmacyRouter);
app.use("/api/v1/medications", medicationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/rooms", roomRouter);

// Handle 404
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// app.use(errorHandler);
// run app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

