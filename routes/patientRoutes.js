const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get(
  "/",
  authController.restrictTo("admin", "doctor", "nurse", "reception"),
  patientController.getAllPatients
);
router.post(
  "/:userId",
  authController.restrictTo("admin", "reception"),
  patientController.createPatient
);

router.get(
  "/:id",
  authController.restrictTo("admin", "doctor", "nurse"),
  patientController.getPatient
);
router.patch(
  "/:id",
  authController.restrictTo("admin", "doctor", "nurse"),
  patientController.updatePatient
);
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  patientController.deletePatient
);

// Special patient routes
router.get("/doctor/:doctorId", patientController.getPatientsByDoctor);
router.get("/nurse/:nurseId", patientController.getPatientsByNurse);

module.exports = router;
