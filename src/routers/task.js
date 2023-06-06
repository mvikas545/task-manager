const express = require("express");
const Task = require("../db/models/task");

const router = new express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send("saved ");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updateableField = ["description", "completed"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid update");
    } else {
      const task = await Task.findById(req.params.id);
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

router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
