const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// CREATE A USER USING : POST "api/auth". DOES'NT REQUIRE AUTH
router.post(
  "/",
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("email", "Please check your email").isEmail(),
    body("password").isLength(5),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    });
    // .then((user) => res.json(user))
    // .catch((e) => {
    //   console.log(e);
    //   res.json({ error: "please enter a valid email" });
    // });
    // let data = result.json();
    res.json(result);
  }
);
module.exports = router;
