const { Devi, validate } = require("../models/devi");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let devis = await Devi.find().select("-__v").sort("date");
  res.send(devis);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const devi = new Devi({
    email: req.body.email,
    objetMessage: req.body.objetMessage,
    message: req.body.message,
  });
  await devi.save();

  res.send(devi);
});

router.delete("/:id", auth, async (req, res) => {
  const devi = await Devi.findByIdAndRemove(req.params.id);

  if (!devi) return res.status(404).send("l'devi avec cette id n'existe pas.");

  res.send(devi);
});

router.get("/:id", async (req, res) => {
  const devi = await Devi.findById(req.params.id).select("-__v");

  if (!devi) return res.status(404).send("l'devi avec cette id n'existe pas.");

  res.send(devi);
});

module.exports = router;
