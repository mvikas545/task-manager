const express = require("express");
const Task = require("../db/models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate("tasks");
    console.log(req.user);
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updateableField = ["description", "completed"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid update");
    } else {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!task) {
        res.status(404).send("Task not found");
        return;
      }
      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();
      res.send(task);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
