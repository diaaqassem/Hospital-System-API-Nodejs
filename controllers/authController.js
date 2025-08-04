const User = require("../models/User");
const jwt = require("jsonwebtoken");
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    res.status(201).json({ status: "success", token, data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(200).json({ status: "success", token });
  } catch (err) {
    next(err);
  }
};
