const mongoose = require("mongoose");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
mongoose.connect(`${BASE_URL}/scheduler`);
