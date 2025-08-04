const validator = require("validator");
const AppError = require("./appError");

exports.validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new AppError("Please provide a valid email", 400);
  }
};

exports.validatePassword = (password) => {
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new AppError(
      "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol",
      400
    );
  }
};

exports.validatePhoneNumber = (phone) => {
  if (!validator.isMobilePhone(phone)) {
    throw new AppError("Please provide a valid phone number", 400);
  }
};

exports.sanitizeInput = (input) => {
  return validator.escape(validator.trim(input));
};
