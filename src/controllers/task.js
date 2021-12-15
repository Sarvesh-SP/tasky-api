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

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
exports.fetchAll = async (req, res) => {
  const match = {};
  const sort = {};
  const { completed } = req.query;

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  if (completed) {
    match.completed = completed === "true";
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });

    if (req.user.tasks.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Task have been save by this user",
      });
    }

    res.send(req.user.tasks);
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
