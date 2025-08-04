const express = require("express");
const doctorController = require("../controllers/doctorController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(doctorController.getAllDoctors)
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    doctorController.createDoctor
  );

router
  .route("/:id")
  .get(doctorController.getDoctor)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    doctorController.updateDoctor
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    doctorController.deleteDoctor
  );

router.get("/stats/top", doctorController.getDoctorStats);

module.exports = router;
