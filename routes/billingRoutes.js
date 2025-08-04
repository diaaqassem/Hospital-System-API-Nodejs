const express = require("express");
const billingController = require("../controllers/billingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/my-bills", billingController.getMyBills);

router
  .route("/")
  .get(
    authController.restrictTo("admin", "manager", "accountant"),
    billingController.getAllBills
  )
  .post(
    authController.restrictTo("admin", "manager", "accountant"),
    billingController.createBill
  );

router
  .route("/:id")
  .get(billingController.getBill)
  .patch(
    authController.restrictTo("admin", "manager", "accountant"),
    billingController.updateBill
  )
  .delete(
    authController.restrictTo("admin", "accountant"),
    billingController.deleteBill
  );

router.post(
  "/:id/pay",
  authController.restrictTo("admin", "accountant", "patient"),
  billingController.makePayment
);

module.exports = router;
