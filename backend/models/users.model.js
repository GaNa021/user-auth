const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Database schema structure for user
let userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);
module.exports = mongoose.model("User", userSchema);
