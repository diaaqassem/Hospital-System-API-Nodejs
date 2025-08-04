const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient",
    required: [true, "Bill must belong to a patient"],
  },
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
  },
  admission: {
    type: mongoose.Schema.ObjectId,
    ref: "Admission",
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      type: {
        type: String,
        enum: ["consultation", "medication", "procedure", "room", "other"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Bill must have a total amount"],
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "partial", "paid", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "insurance", "bank-transfer", "other"],
  },
  insuranceClaim: {
    isClaimed: Boolean,
    claimAmount: Number,
    claimStatus: String,
  },
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

billingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "patient",
    select: "user",
    populate: {
      path: "user",
      select: "name",
    },
  })
    .populate("appointment")
    .populate("admission");
  next();
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
