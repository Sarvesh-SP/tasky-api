const Task = require("../models/task");

exports.create = async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.fetch = async (req, res) => {
  try {
    const task = req.task;
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
    const task = req.task;

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    if (!task) {
      return res.status(404).send("Not found");
    }
    res.send(task);
  } catch (e) {
    return res.send(500).send(e);
  }
};

exports.tensai = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

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

//Params-------------------------------------------------------

exports.fetchId = async (req, res, next, id) => {
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send("Not found");
    }
    req.send(task);
  } catch (e) {
    return res.status(500).send({ error: e });
  }
};
