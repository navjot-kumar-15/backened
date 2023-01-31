const connect = require("./db");
const express = require("express");
var cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

// connect();

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.listen(PORT);
