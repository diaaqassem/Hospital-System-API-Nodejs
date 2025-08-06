const Room = require("../models/Room");
const AppError = require("../utils/appError");

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
