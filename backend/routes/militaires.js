const { Militaire, validate } = require("../models/militaire");
const mongoose = require("mongoose");
const express = require("express");
const { Fonction } = require("../models/fonction");
const router = express.Router();

router.get("/", async (req, res) => {
  const militaires = await Militaire.find()
    .populate("fonction", "nom ")
    .sort("grade");
  res.send(militaires);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fonction = await Fonction.findById(req.body.fonction);
  if (!fonction) return res.status(400).send("Fonction Invalide.");

  const militaire = new Militaire({
    nom: req.body.nom,
    prenom: req.body.prenom,
    grade: req.body.grade,
    mle: req.body.mle,
    uniteOrigine: req.body.uniteOrigine,
    fonction: {
      _id: fonction._id,
      nom: fonction.nom,
    },
  });
  await militaire.save();
  res.send(militaire);
});

router.get("/:id", async (req, res) => {
  try {
    const militaire = await Militaire.findById(req.params.id).select("-__v");
    res.send(militaire);
  } catch (error) {
    return res.status(404).send("le militaire avec cette id n'existe pas");
  }

  // const fonction = await Fonction.findById(militaire.fonction).select("-__v");
  // militaire.fonction = fonction;
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fonction = await Fonction.findById(req.body.fonction);
  if (!fonction) return res.status(400).send("Invalid fonction.");
  const militaire = await Militaire.findByIdAndUpdate(
    req.params.id,
    {
      nom: req.body.nom,
      prenom: req.body.prenom,
      grade: req.body.grade,
      mle: req.body.mle,
      uniteOrigine: req.body.uniteOrigine,
      fonction: {
        _id: fonction._id,
        nom: fonction.nom,
      },
    },
    { new: true }
  );
  if (!militaire)
    return res.status(404).send("militaire avec cet Id n'existe pas");
  res.send(militaire);
});
router.delete("/:id", async (req, res) => {
  const militaire = await Militaire.findByIdAndRemove(req.params.id);

  if (!militaire)
    return res
      .status(404)
      .send("The militaire with the given ID was not found.");

  res.send(militaire);
});
module.exports = router;
