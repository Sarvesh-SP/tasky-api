const express = require("express");
const Task = require("../models/task");
const router = express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send("Not found");
    }
    res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["description", "completed"];

  const isValid = updates.every((update) => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send("Invalid Updates");
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send("Not found");
    }
    res.send(task);
  } catch (e) {
    return res.send(500).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
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
});

module.exports = router;
