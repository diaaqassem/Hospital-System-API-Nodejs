const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// // Public routes (no authentication required)
// router.post("/signup", authController.signup);
// router.post("/login", authController.login);
// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);
// // router.get("/me", userController.getMe, userController.getUser);

// // Protect all routes after this middleware (require authentication)
router.use(authController.protect);

// Routes for logged-in users
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.patch("/updateMyPassword", authController.updatePassword);

// Restrict the following routes to admin only
router.use(authController.restrictTo("admin"));

// Admin routes
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
