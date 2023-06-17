const express = require("express");
const User = require("../db/models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User({ ...req.body });

  try {
    await user.save();
    const token = await user.generateJsonWebToken();
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
    const token = await user.generateJsonWebToken();
    if (!user) {
      res.status(400);
      return;
    }
    console.log("token", token);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updateableField = ["name", "email", "password", "age"];
  try {
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      updateableField.includes(update)
    );
    if (!isValidUpdate) {
      res.status(400).send("inavalid update");
    } else {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  console.log("user", req.user);
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
});

module.exports = router;
