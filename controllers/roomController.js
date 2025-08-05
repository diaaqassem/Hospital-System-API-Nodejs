const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Room = require("../models/Room")
const roomService = require("../services/roomService");
const factory = require("./handlerFactory")

exports.getAllRooms = factory.getAll(Room)

exports.getRoom = factory.getOne(Room)

exports.createRoom = factory.createOne(Room)

exports.updateRoom = factory.updateOne(Room)

exports.deleteRoom = factory.deleteOne(Room)

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const availability = await roomService.checkRoomAvailability(
    req.params.roomId,
    req.query.checkIn,
    req.query.checkOut
  );

  res.status(200).json({
    status: "success",
    data: availability,
  });
});
