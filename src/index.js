const express = require("express");
const User = require("./db/models/user");
const Task = require("./db/models/task");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

//to parse req as json
app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User({ ...req.body });
  console.log("req", user);
  user
    .save()
    .then(() => {
      res.save(201).send(user);
    })
    .catch((error) => {
      console.log("error", error);
      res.status(400).send(error);
    });
});
app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send("saved ");
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send("user not found");
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        res.status(404).send("task not found");
      }
      res.send(task);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});
app.listen(port, () => {
  console.log("Server is up on port", port);
});
