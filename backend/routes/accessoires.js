const { Accessoire, validate } = require("../models/accessoire");
// const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/" /* , auth */, async (req, res) => {
  const accessoires = await Accessoire.find().select("-__v").sort("name");
  res.send(accessoires);
});

router.post("/" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let accessoire = new Accessoire({
    name: req.body.name,
    image: req.body.image,
  });
  accessoire = await accessoire.save();

  res.send(accessoire);
});

router.put("/:id" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const accessoire = await Accessoire.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
    },
    { new: true }
  );

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

router.delete("/:id" /* , auth */, async (req, res) => {
  const accessoire = await Accessoire.findByIdAndRemove(req.params.id);

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

router.get("/:id" /* , auth */, async (req, res) => {
  const accessoire = await Accessoire.findById(req.params.id).select("-__v");

  if (!accessoire)
    return res.status(404).send("l'accessoire avec cette id n'existe pas.");

  res.send(accessoire);
});

module.exports = router;
