const User = require("../models/user");
const sharp = require("sharp");
const { sendEmail, cancelEmail } = require("../services/account");
const multer = require("multer");

//Creat new User
exports.create = async (req, res) => {
	const user = User(req.body);

	try {
		await user.save();
		sendEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		return res.status(401).send({ error: e.message });
	}
};

//Fetch All Users
exports.readProfile = async (req, res) => {
	try {
		const user = req.user;
		await user.populate("tasks");
		res.send({ user, tasks: user.tasks });
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
};

//Fetch Single User
exports.fetch = async (req, res) => {
	try {
		const user = req.user;
		await user.populate("task");
		res.send(user);
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
};

//Update a Single User
exports.updateSingle = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "email", "password", "age"];

	const isValid = updates.every((update) => allowedUpdates.includes(update));

	if (!isValid) {
		return res.status(400).send({ error: "Invalid Field Provided!." });
	}

	try {
		const user = req.user;
		updates.forEach((update) => (user[update] = req.body[update]));

		await user.save();
		if (!user) {
			return res.status(404).send("Not found");
		}

		res.send(user);
	} catch (e) {
		return res.status(400).send({ error: e.message });
	}
};

exports.logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();

		res.send("Logged out");
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
};

exports.maxLogout = async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();

		res.send("Logged out of all accounts");
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
};

//Delete One user
exports.tensai = async (req, res) => {
	try {
		const user = req.user;
		const k = await user.remove();
		if (!user) {
			return res.status(404).send("Not found");
		}

		cancelEmail(k.email, k.name);
		res.send({
			deleted: true,
			user: k,
		});
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
};

//Login
exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.credentials(email, password);

		if (user.error) {
			return res
				.status(404)
				.send({ success: false, message: "User does'nt exist" });
		}
		const token = await user.generateAuthToken();
		res.send({ user: user, token });
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
};

//File Upload=======================================

const upload = multer({
	limits: {
		fileSize: 1000000 * 10, //1MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Please upload a Image(jpg, jpeg or png)"));
		}

		cb(null, true);
	},
}).single("avatar");

exports.upload = async (req, res) => {
	upload(req, res, async function (err) {
		try {
			const buffer = await sharp(req.file.buffer)
				.resize({ width: 250, height: 250 })
				.png()
				.toBuffer();
			if (err instanceof multer.MulterError) {
				throw err;
			} else if (err) {
				throw err;
			}
			req.user.avatar.data = buffer;
			await req.user.save();
			res.send();
		} catch (e) {
			return res.status(400).send({ uploadError: e.message });
		}
	});
};

exports.imgDelete = async (req, res) => {
	req.user.avatar = {};
	await req.user.save();
	res.send();
};

exports.fetchImg = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar.data) {
			throw new Error("No Avatar or user found");
		}

		res.set("Content-Type", "image/jpg");

		res.send(user.avatar.data);
	} catch (e) {
		return res.status(400).send({ error: e.message });
	}
};
