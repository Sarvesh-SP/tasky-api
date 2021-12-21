const express = require("express");
const connect = require("./config/db");

//routers
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

connect();
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
	res.send("Well the Server is Running...");
});

module.exports = app;
