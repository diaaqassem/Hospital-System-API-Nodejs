const AuditLog = require("../models/AuditLog");
const AppError = require("./appError");

exports.logAction = async (user, action, entityType, entityId, changes) => {
  try {
    await AuditLog.create({
      user,
      action,
      entityType,
      entityId,
      changes,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
};

exports.getUserActions = async (userId, limit = 50) => {
  return await AuditLog.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

exports.getEntityHistory = async (entityType, entityId, limit = 50) => {
  return await AuditLog.find({ entityType, entityId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("user", "name role");
};
