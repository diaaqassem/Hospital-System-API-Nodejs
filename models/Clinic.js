const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A clinic must have a name"],
  },
  freeDate: {
    type: Date,
    required: [true, "A clinic must have free dates"],
  },
  dateInDay: {
    type: String,
    required: [true, "A clinic must have dates in day"],
  },
  price: {
    type: Number,
    required: [true, "A clinic must have a price"],
  },
  ticket: {
    type: Number,
    default: 0,
  },
  payment: {
    type: String,
    enum: ["cash", "credit"],
    default: "cash",
  },
  doctorID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Clinic must belong to a doctor"],
  },
});

const Clinic = mongoose.model("Clinic", clinicSchema);
module.exports = Clinic;
