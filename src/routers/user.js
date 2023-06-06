const express = require("express");
const User = require("../db/models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User({ ...req.body });

  try {
    await user.save();
    const token = user.generateJsonWebToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findUserByCredential(
      req.body.email,
      req.body.password
    );
    const token = user.generateJsonWebToken();
    if (!user) {
      res.status(400);
      return;
    }
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
  const updateableField = ["name", "email", "password", "age"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("inavalid update");
    } else {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send("user not found");
        return;
      }
      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
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

module.exports = router;
