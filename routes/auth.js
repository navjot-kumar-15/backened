const express = require("express");
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");

// CREATING A USER USING : POST "api/auth". DOES'NT REQUIRE AUTH
router.post(
  "/",
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("email", "Please check your email").isEmail(),
    body("password").isLength(5),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    user
      .create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
      .then((user) => {
        res.json(user);
      })
      .catch((e) => {
        console.log(e);
        res.json({ error: "Please enter the valid email" });
      });
  }
);
module.exports = router;
