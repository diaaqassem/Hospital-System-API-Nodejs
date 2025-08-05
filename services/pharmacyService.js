// const Pharmacy = require('../models/Pharmacy');
// const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

// exports.getAllPharmacies = async (query) => {
//   const features = new APIFeatures(Pharmacy.find(), query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   return await features.query;
// };

// exports.getPharmacy = async (id) => {
//   return await Pharmacy.findById(id).populate('medications');
// };

// exports.createPharmacy = async (data) => {
//   return await Pharmacy.create(data);
// };

// exports.updatePharmacy = async (id, data) => {
//   return await Pharmacy.findByIdAndUpdate(id, data, {
//     new: true,
//     runValidators: true
//   });
// };

// exports.deletePharmacy = async (id) => {
//   return await Pharmacy.findByIdAndDelete(id);
// };

// exports.getPharmacyWithin = async (distance, latlng, unit = 'mi') => {
//   const [lat, lng] = latlng.split(',');
//   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

//   if (!lat || !lng) {
//     throw new AppError(
//       'Please provide latitude and longitude in the format lat,lng',
//       400
//     );
//   }

//   return await Pharmacy.find({
//     location: {
//       $geoWithin: { $centerSphere: [[lng, lat], radius] }
//     }
//   });
// };

// exports.getDistances = async (latlng, unit = 'mi') => {
//   const [lat, lng] = latlng.split(',');
//   const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

//   if (!lat || !lng) {
//     throw new AppError(
//       'Please provide latitude and longitude in the format lat,lng',
//       400
//     );
//   }

//   return await Pharmacy.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [lng * 1, lat * 1]
//         },
//         distanceField: 'distance',
//         distanceMultiplier: multiplier
//       }
//     },
//     {
//       $project: {
//         distance: 1,
//         name: 1
//       }
//     }
//   ]);
// };