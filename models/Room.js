const roomSchema = new mongoose.Schema(
  {
    roomid: String,
    roomcost: Number,
    roomnum: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);
