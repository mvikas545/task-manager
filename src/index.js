const express = require("express");
const User = require("./db/models/user");
const Task = require("./db/models/task");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

//to parse req as json
app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User({ ...req.body });

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send("saved ");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(e);
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send("user not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/tasks/:id", async (req, res) => {
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

app.patch("/users/:id", async (req, res) => {
  const updateableField = ["name", "email", "password", "age"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("inavalid update");
    } else {
      const user = await User.findByIdAndUpdate(req.params.id, { ...req.body });

      if (!user) {
        res.status(404).send("user not found");
      }
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
app.patch("/tasks/:id", async (req, res) => {
  const updateableField = ["description", "completed"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("Invalid update");
    } else {
      const task = await User.findByIdAndUpdate(req.params.id, { ...req.body });
      if (!task) {
        res.status(404).send("Task not found");
      }
      res.send(task);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send("user not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/tasks/:id", async (req, res) => {
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

app.listen(port, () => {
  console.log("Server is up on port", port);
});
