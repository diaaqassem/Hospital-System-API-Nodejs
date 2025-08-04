const Room = require("../models/Room");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllRooms = async (query) => {
  const features = new APIFeatures(Room.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.getRoom = async (id) => {
  return await Room.findById(id);
};

exports.createRoom = async (data) => {
  // Check if room number already exists
  const existingRoom = await Room.findOne({ roomNumber: data.roomNumber });
  if (existingRoom) {
    throw new AppError("Room number already exists", 400);
  }

  return await Room.create(data);
};

exports.updateRoom = async (id, data) => {
  return await Room.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteRoom = async (id) => {
  return await Room.findByIdAndDelete(id);
};

exports.checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new AppError("No room found with that ID", 404);
  }

  // In a real implementation, you would check against admissions
  if (room.status !== "available") {
    return {
      available: false,
      message: `Room is currently ${room.status}`,
    };
  }

  return {
    available: true,
    room,
  };
};

exports.updateRoomStatus = async (roomId, status) => {
  return await Room.findByIdAndUpdate(roomId, { status }, { new: true });
};
