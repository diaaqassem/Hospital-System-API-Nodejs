const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get("/", medicationController.getAllMedications);
router.post(
  "/",
  authController.restrictTo("admin", "pharmacy"),
  medicationController.createMedication
);

router.get("/:id", medicationController.getMedication);
router.patch(
  "/:id",
  authController.restrictTo("admin", "pharmacy"),
  medicationController.updateMedication
);
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  medicationController.deleteMedication
);

// Special medication routes
router.get(
  "/pharmacy/:pharmacyId",
  medicationController.getMedicationsByPharmacy
);
router.get("/search/:name", medicationController.searchMedications);

module.exports = router;
