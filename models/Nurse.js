const nurseSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    service: String,
    review: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Nurse", nurseSchema);
