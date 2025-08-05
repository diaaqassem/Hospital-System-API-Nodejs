// const Medication = require("../models/Medication");
// const Pharmacy = require("../models/Pharmacy");
// const AppError = require("../utils/appError");
// const APIFeatures = require("../utils/apiFeatures");

// exports.getAllMedications = async (query) => {
//   const features = new APIFeatures(Medication.find(), query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   return await features.query;
// };

// exports.getMedication = async (id) => {
//   return await Medication.findById(id);
// };

// exports.createMedication = async (data) => {
//   const medication = await Medication.create(data);

//   // Update pharmacy medications count
//   await Pharmacy.findByIdAndUpdate(data.pharmacy, {
//     $inc: { medicationsCount: 1 },
//   });

//   return medication;
// };

// exports.updateMedication = async (id, data) => {
//   return await Medication.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true,
//   });
// };

// exports.deleteMedication = async (id) => {
//   const medication = await Medication.findByIdAndDelete(id);

//   if (medication) {
//     // Update pharmacy medications count
//     await Pharmacy.findByIdAndUpdate(medication.pharmacy, {
//       $inc: { medicationsCount: -1 },
//     });
//   }

//   return medication;
// };

// exports.checkStock = async (pharmacyId, medicationId, quantity) => {
//   const medication = await Medication.findOne({
//     _id: medicationId,
//     pharmacy: pharmacyId,
//   });

//   if (!medication) {
//     throw new AppError("Medication not found in this pharmacy", 404);
//   }

//   if (medication.stock < quantity) {
//     throw new AppError(
//       `Not enough stock. Only ${medication.stock} available`,
//       400
//     );
//   }

//   return medication;
// };

// exports.updateStock = async (medicationId, quantity) => {
//   return await Medication.findByIdAndUpdate(
//     medicationId,
//     { $inc: { stock: -quantity } },
//     { new: true }
//   );
// };
