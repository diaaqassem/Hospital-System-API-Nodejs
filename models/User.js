const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  profileImage: {
    type: String,
    default: "default.jpg",
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  addresses: [
    {
      type: String,
    },
  ],
  resetCode: String,
  resetCodeExpire: Date,
  resetVerified: Boolean,
  role: {
    type: String,
    enum: [
      "patient",
      "doctor",
      "manager",
      "pharmacy",
      "nurse",
      "admin",
      "reception",
    ],
    default: "patient",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// // 2) Generate the random reset token
// userSchema.methods.generateResetToken = function () {
//   const resetToken = jwt.sign({ id: this._id }, process.env.JWT_RESET_TOKEN, {
//     expiresIn: "10m",
//   });
//   this.resetCode = resetToken;
//   this.resetCodeExpire = Date.now() + 10 * 60 * 1000;
//   return this;
// };

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
