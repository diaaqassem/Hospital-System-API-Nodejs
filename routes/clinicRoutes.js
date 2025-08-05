const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinicController");
const authController = require("../controllers/authController");

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/", clinicController.getAllClinics);
router.post(
  "/",
  authController.restrictTo("admin", "doctor"),
  clinicController.createClinic
);

router.get("/:id", clinicController.getClinic);
router.patch(
  "/:id",
  authController.restrictTo("admin", "doctor"),
  clinicController.updateClinic
);
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  clinicController.deleteClinic
);

// Special clinic routes
router.get("/doctor/:doctorId", clinicController.getClinicsByDoctor);

module.exports = router;
