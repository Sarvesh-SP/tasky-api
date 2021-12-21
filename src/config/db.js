require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = () => {
	mongoose
		.connect(process.env.MONGO_PROD, {
			useNewUrlParser: true,
		})
		.then(() => {
			console.log("Connect DB");
		});
};

module.exports = connectDB;
