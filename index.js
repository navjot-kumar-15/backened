const connect = require("./db");
const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// connect();

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.listen(5000);
