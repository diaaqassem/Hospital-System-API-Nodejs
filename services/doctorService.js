const Doctor = require("../models/Doctor");

exports.getDoctorStats = async () => {
  return await Doctor.aggregate([
    {
      $match: { rating: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$specialty",
        numDoctors: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        avgFee: { $avg: "$consultationFee" },
        minFee: { $min: "$consultationFee" },
        maxFee: { $max: "$consultationFee" },
      },
    },
    {
      $sort: { avgRating: -1 },
    },
  ]);
};
