const { StageEffectue, validate } = require("../models/stageEffectue");
const mongoose = require("mongoose");
const express = require("express");
const { Militaire } = require("../models/militaire");
const { Stage } = require("../models/stage");

const router = express.Router();

router.get("/", async (req, res) => {
  const stagesEffectues = await StageEffectue.find()
    .populate("militaire", "grade nom prenom -_id")
    .populate("stage", "nom -_id")
    .sort("dateDebut");
  res.send(stagesEffectues);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const militaire = await Militaire.findById(req.body.militaire);
  if (!militaire) return res.status(400).send("Militaire Invalide.");

  const stage = await Stage.findById(req.body.stage);
  if (!stage) return res.status(400).send("Stage Invalide");

  const stageEffectue = new StageEffectue({
    stage: {
      _id: stage._id,
      nom: stage.nom,
    },
    militaire: {
      _id: militaire._id,
      nom: militaire.nom,
    },
    dateDebut: req.body.dateDebut,
    dateFin: req.body.dateFin,
  });
  await stageEffectue.save();
  res.send(stageEffectue);
});

router.get("/:id", async (req, res) => {
  const stagesEffectues = await StageEffectue.findById(req.params.id);
  if (!stagesEffectues)
    return res.status(404).send("le stage effectue avec cette id n'existe pas");
  res.send(stagesEffectues);
});

module.exports = router;
