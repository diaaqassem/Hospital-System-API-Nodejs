const express = require("express");
const router = express.Router();
const nurseController = require("../controllers/nurseController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get("/", nurseController.getAllNurses);
router.post(
  "/:userId",
  authController.restrictTo("admin", "manager"),
  nurseController.createNurse
);

router.get("/:id", nurseController.getNurse);
router.patch(
  "/:id",
  authController.restrictTo("admin", "nurse"),
  nurseController.updateNurse
);
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  nurseController.deleteNurse
);

// Special nurse routes
router.get("/available", nurseController.getAvailableNurses);

module.exports = router;
