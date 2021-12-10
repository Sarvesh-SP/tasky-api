const User = require("../models/user");

//Creat new User
exports.create = async (req, res) => {
  const user = User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    return res.status(401).send(e);
  }
};

//Fetch All Users
exports.readProfile = async (req, res) => {
  try {
    const user = req.user;
    await user.populate("tasks");
    res.send(user.tasks);
  } catch (e) {
    return res.status(500).send(e);
  }
};

//Fetch Single User
exports.fetch = async (req, res) => {
  try {
    const user = req.user;
    await user.populate("task");
    res.send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
};

//Update a Single User
exports.updateSingle = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid updates!." });
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
    return res.status(400).send({ e });
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
    return res.status(500).send({ message: "Did'nt logout properly" });
  }
};

exports.maxLogout = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send("Logged out of all accounts");
  } catch (e) {
    return res.status(500).send({ message: "Did'nt logout properly" });
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

    res.send({
      deleted: true,
      user: k,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};

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
    res.status(400).send({ error: `Something went wrong ${e}` });
  }
};

//Params

exports.fetchId = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send("Not Found");
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(500).send({ error: e });
  }
};
