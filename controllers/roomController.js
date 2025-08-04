const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const roomService = require("../services/roomService");

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await roomService.getAllRooms(req.query);

  res.status(200).json({
    status: "success",
    results: rooms.length,
    data: {
      rooms,
    },
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await roomService.getRoom(req.params.id);

  if (!room) {
    return next(new AppError("No room found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  const newRoom = await roomService.createRoom(req.body);

  res.status(201).json({
    status: "success",
    data: {
      room: newRoom,
    },
  });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
  const room = await roomService.updateRoom(req.params.id, req.body);

  if (!room) {
    return next(new AppError("No room found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
  await roomService.deleteRoom(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
