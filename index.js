const connect = require("./db");
const express = require("express");
const app = express();
app.use(express.json());
// connect();

// available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.listen(5000);
