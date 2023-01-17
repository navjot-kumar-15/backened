const express = require("express");
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");
const { exists } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "navjotisagoodb$oy";

// Creating a user or saving the user by using : POST -> method  "api/auth/createuser".No loign require.
router.post(
  "/createuser",
  // Validator using
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("email", "Please check your email").isEmail(),
    body("password").isLength(5),
  ],
  async (req, res) => {
    // If there are error then shows bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user already exist or not
    // Handling error
    try {
      let User = await user.findOne({ email: req.body.email });
      // Showing the error if user already exists
      if (User) {
        return res
          .status(400)
          .json({ error: "Sorry with this email user already exist" });
      }
      // Hashing the password using bcrypt js
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Creation of user
      User = await user.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      // Applying JWT authentication below
      const data = {
        User: {
          id: User.id,
        },
      };
      const jwtAuthToken = jwt.sign(data, JWT_SECRET);
      console.log(jwtAuthToken);
      res.json({ jwtAuthToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);
module.exports = router;
