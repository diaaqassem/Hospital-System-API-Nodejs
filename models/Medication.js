const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A medication must have a name"],
    trim: true,
    unique: true,
  },
  genericName: String,
  dosageForm: {
    type: String,
    enum: ["tablet", "capsule", "syrup", "injection", "ointment", "other"],
  },
  strength: String,
  manufacturer: String,
  price: {
    type: Number,
    required: [true, "A medication must have a price"],
  },
  stock: {
    type: Number,
    required: [true, "A medication must have stock quantity"],
    min: [0, "Stock cannot be negative"],
  },
  pharmacy: {
    type: mongoose.Schema.ObjectId,
    ref: "Pharmacy",
    required: [true, "Medication must belong to a pharmacy"],
  },
  category: String,
  prescriptionRequired: {
    type: Boolean,
    default: false,
  },
  expiryDate: Date,
  barcode: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

medicationSchema.index({ name: 1, pharmacy: 1 }, { unique: true });

medicationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "pharmacy",
    select: "name location",
  });
  next();
});

medicationSchema.pre("save", function (next) {
  if (this.isNew) {
    this.constructor.calcMedicationsCount(this.pharmacy);
  }
  next();
});

medicationSchema.statics.calcMedicationsCount = async function (pharmacyId) {
  const stats = await this.aggregate([
    {
      $match: { pharmacy: pharmacyId },
    },
    {
      $group: {
        _id: "$pharmacy",
        nMedications: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Pharmacy.findByIdAndUpdate(pharmacyId, {
      medicationsCount: stats[0].nMedications,
    });
  } else {
    await Pharmacy.findByIdAndUpdate(pharmacyId, {
      medicationsCount: 0,
    });
  }
};

const Medication = mongoose.model("Medication", medicationSchema);
module.exports = Medication;
