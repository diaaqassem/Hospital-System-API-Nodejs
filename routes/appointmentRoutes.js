const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/my-appointments", appointmentController.getMyAppointments);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "manager", "doctor"),
    appointmentController.getAllAppointments
  )
  .post(appointmentController.createAppointment);

router
  .route("/:id")
  .get(appointmentController.getAppointment)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
