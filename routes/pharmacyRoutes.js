const express = require("express");
const pharmacyController = require("../controllers/pharmacyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(pharmacyController.getAllPharmacies)
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    pharmacyController.createPharmacy
  );

router
  .route("/:id")
  .get(pharmacyController.getPharmacy)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    pharmacyController.updatePharmacy
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    pharmacyController.deletePharmacy
  );

router.get(
  "/within/:distance/center/:latlng/unit/:unit",
  pharmacyController.getPharmaciesWithin
);
router.get("/distances/:latlng/unit/:unit", pharmacyController.getDistances);

module.exports = router;
