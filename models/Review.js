const reviewSchema = new mongoose.Schema(
  {
    name: String,
    content: String,
    rating: Number,
    forModel: {
      type: String,
      enum: ["clinic", "doctor", "nurse"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Review", reviewSchema);
