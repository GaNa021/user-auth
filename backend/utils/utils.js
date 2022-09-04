const jwt = require("jsonwebtoken");

// Creates a JWT for given user details
exports.createJWT = (email, userId, duration) => {
  const payload = {
    email,
    userId,
    duration
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration
  });
};

// Validates the given user details and return errors
exports.validateUserData = (username, email, password) => {
  let errors = [];
  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (username != undefined && !username) {
    errors.push({ username: "required" });
  }
  if (email != undefined) {
    if (!email) {
      errors.push({ email: "required" });
    }
    if (email && !emailRegexp.test(email)) {
      errors.push({ email: "invalid" });
    }
  }

  if (!password) {
    errors.push({ password: "required" });
  }

  return { errors: errors };
};
