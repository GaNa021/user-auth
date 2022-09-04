const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/users.controller");

// Redirects to signup method in controllers
router.post("/signup", signup);

// Redirects to signin method in controllers
router.post("/signin", signin);

module.exports = router;
