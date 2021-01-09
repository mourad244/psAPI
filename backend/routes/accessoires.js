const { Accessoire, validate } = require("../models/accessoire");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const uploadFile = require("../middleware/uploadImage");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  const accessoires = await Accessoire.find().select("-__v").sort("name");
  res.send(accessoires);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const accessoire = new Accessoire({
      name: req.body.name,
      image: req.file.path,
    });
    await accessoire.save();

    res.send(accessoire);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadFile(req, res);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const accessoire = await Accessoire.findOne({ _id: req.params.id });

  if (req.file) {
    if (accessoire.image) fs.unlinkSync(accessoire.image);
    accessoire.image = req.file.path;
  }

  if (req.body) {
    accessoire.name = req.body.name;
  }
  await accessoire.save();

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

router.delete("/:id", auth, async (req, res) => {
  const accessoire = await Accessoire.findByIdAndRemove(req.params.id);
  fs.unlinkSync(accessoire.image);

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

router.get("/:id", async (req, res) => {
  const accessoire = await Accessoire.findById(req.params.id).select("-__v");

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

module.exports = router;
