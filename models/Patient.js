const patientSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    number: String,
    disease: String,
    medication: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Patient", patientSchema);
