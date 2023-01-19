const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { exists } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "navjotisagoodb$oy";

// <<<<<<<<<<=======================Create User Route=======================>>>>>>>>>>

//ROUTE :1;
// Creating a user or saving the user by using : POST -> method  "api/auth/createuser".No  login require.
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
      let user = await User.findOne({ email: req.body.email });
      // Showing the error if user already exists
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry with this email user already exist" });
      }
      // Hashing the password using bcrypt js
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Creation of user
      user = await User.create({
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
      res.status(500).send("Internal server error");
    }
  }
);
// <<<<<<<<<<=============================Login Route============================>>>>>>>>>>

// ROUTE :2;
// Authenticate a user  using : POST -> method  "api/auth/login".No login require.
router.post(
  "/login",
  // Validator using
  [
    body("email", "Please check your email").isEmail(),
    body("password", "Password cannot be blank ").exists(),
  ],
  async (req, res) => {
    // If there are error then shows bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructing from the req body
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      // If user not exist then show this error
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Now comparing the password which is entered by the user and with the database
      const passCom = await bcrypt.compare(password, user.password);
      if (!password) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Applying JWT authentication below
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtAuthToken = jwt.sign(data, JWT_SECRET);
      res.json({ jwtAuthToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE :3;
// Get logged in  user details using  : POST -> method  "api/auth/getuser". login require.

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
