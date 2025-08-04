const Billing = require("../models/Billing");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllBills = async (query) => {
  const features = new APIFeatures(Billing.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
};

exports.getBill = async (id) => {
  return await Billing.findById(id);
};

exports.createBill = async (data) => {
  // Calculate total amount
  if (!data.totalAmount && data.items) {
    data.totalAmount = data.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  return await Billing.create(data);
};

exports.updateBill = async (id, data) => {
  if (data.items) {
    data.totalAmount = data.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  return await Billing.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteBill = async (id) => {
  return await Billing.findByIdAndDelete(id);
};

exports.makePayment = async (billId, amount, method) => {
  const bill = await Billing.findById(billId);
  if (!bill) {
    throw new AppError("No bill found with that ID", 404);
  }

  const newPaidAmount = bill.paidAmount + amount;
  let newPaymentStatus = bill.paymentStatus;

  if (newPaidAmount >= bill.totalAmount) {
    newPaymentStatus = "paid";
  } else if (newPaidAmount > 0) {
    newPaymentStatus = "partial";
  }

  return await Billing.findByIdAndUpdate(
    billId,
    {
      paidAmount: newPaidAmount,
      paymentStatus: newPaymentStatus,
      paymentMethod: method,
    },
    { new: true }
  );
};

exports.getPatientBills = async (patientId) => {
  return await Billing.find({ patient: patientId }).sort({ createdAt: -1 });
};
