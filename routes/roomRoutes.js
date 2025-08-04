const express = require("express");
const roomController = require("../controllers/roomController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(roomController.getAllRooms)
  .post(
    authController.restrictTo("admin", "manager"),
    roomController.createRoom
  );

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(
    authController.restrictTo("admin", "manager"),
    roomController.updateRoom
  )
  .delete(authController.restrictTo("admin"), roomController.deleteRoom);

router.get("/:roomId/availability", roomController.checkAvailability);

module.exports = router;
