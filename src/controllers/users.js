const User = require("../models/user");

//Creat new User
exports.create = async (req, res) => {
  const user = User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    return res.status(401).send(e);
  }
};

//Fetch All Users
exports.fetchAll = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (e) {
    return res.status(500).send(e);
  }
};

//Fetch Single User
exports.fetch = async (req, res) => {
  try {
    const user = req.user;

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
