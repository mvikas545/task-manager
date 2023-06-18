const express = require("express");
const User = require("../db/models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const imageExtensionRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!imageExtensionRegex.test(file.originalname)) {
      return cb(new Error("Please upload image only"));
    }
    cb(null, true);
  },
});

const avatarErrorHandler = (error, req, res, next) => {
  res.status(400).send({
    error: error.message,
  });
};

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

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  avatarErrorHandler
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Avatar not found");
    }
    res.set("Content-type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
