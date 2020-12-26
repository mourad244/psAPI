const { Permission, validate } = require("../models/permission");
const mongoose = require("mongoose");
const express = require("express");
const { Militaire } = require("../models/militaire");
const router = express.Router();

router.get("/", async (req, res) => {
  const permissions = await Permission.find()
    .populate("militaire", "grade nom prenom")
    .sort("dateDepart");
  res.send(permissions);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const militaire = await Militaire.findById(req.body.militaire);
  if (!militaire) return res.status(400).send("Militaire Invalide.");

  const permission = new Permission({
    militaire: {
      _id: militaire._id,
      nom: militaire.nom,
    },
    type: req.body.type,
    dateDepart: req.body.dateDepart,
    dateArrivee: req.body.dateArrivee,
  });
  await permission.save();
  res.send(permission);
});

router.get("/:id", async (req, res) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission)
    return res.status(404).send("la permission avec cette id n'existe pas");
  res.send(permission);
});

module.exports = router;
