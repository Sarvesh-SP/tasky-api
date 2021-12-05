const mongoose = require("mongoose");
const validator = require("validator");
const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1/task-manager", {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Connect DB");
    });
};

module.exports = connectDB;
