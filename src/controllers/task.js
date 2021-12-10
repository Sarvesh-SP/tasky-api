const Task = require("../models/task");

exports.create = async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user.id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const task = await Task.find({ user: req.user.id });
    if (task.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Task have been save by this user",
      });
    }

    res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.fetch = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task Not found for that particular user",
      });
    }
    res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["description", "completed"];

  const isValid = updates.every((update) => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send("Invalid Updates");
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).send("Not found");
    }
    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();
    res.send(task);
  } catch (e) {
    return res.send(500).send(e);
  }
};

exports.tensai = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).send("Not found");
    }

    res.send({
      deleted: true,
      task,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};
