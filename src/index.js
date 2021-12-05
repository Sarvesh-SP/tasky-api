const express = require("express");
const connect = require("./config/db");

//routers
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

connect();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port http://localhost:${port}`);
});
