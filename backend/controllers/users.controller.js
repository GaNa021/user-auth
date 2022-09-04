const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT, validateUserData } = require("../utils/utils");

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Method for new user sigup
exports.signup = (req, res, next) => {
  let { username, email, password } = req.body;

  // Validation of given user data
  let errors = validateUserData(email, password);
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  // Query to check if given user already exists
  User.findOne({
    $or: [{ email: email }, { username: username }]
  })
    .then((user) => {
      if (user) {
        return res
          .status(422)
          .json({ errors: "username or email already exists" });
      } else {
        // Creating new User
        const user = new User({
          username: username,
          email: email,
          password: password
        });

        // Encrypting password
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;

            // Saving new User in database
            user
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }]
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }]
      });
    });
};

// Method for exsiting user sigin
exports.signin = (req, res) => {
  let { username, email, password } = req.body;

  // Validation of given user data
  let errors = validateUserData(username, email, password);
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  // Query to check if given user already exists
  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "not found" }]
        });
      } else {
        // Password macthing with database
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ password: "incorrect" }] });
            }

            // Creating a JWT token for sigined user
            let access_token = createJWT(user.email, user._id, 3600);

            // Verifying created token
            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ erros: err });
                }
                if (decoded) {
                  return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user
                  });
                }
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ erros: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ erros: err });
    });
};
