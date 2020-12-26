const {InfoPersonnel, validate} = require('../models/infoPersonnel');
const mongoose = require('mongoose');
const express = require('express');
const { Militaire } = require('../models/militaire');
const router = express.Router();

router.get('/',async (req, res) => {
  const infosPersonnel = await InfoPersonnel
    .find()
    .sort('cin');
  res.send(infosPersonnel);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const militaire = await Militaire.findById(req.body.militaire);
  if(!militaire) return res.status(400).send('Militaire Invalide.');


  const infoPersonnel = new InfoPersonnel({
    militaire: {
      _id: militaire._id,
      nom: militaire.nom
    },
    cin: req.body.cin,
    mutuelle: req.body.mutuelle,
    adresse: req.body.adresse,
    dateNaissance: req.body.dateNaissance,
    telephone: req.body.telephone
  });
  await infoPersonnel.save();
  res.send(infoPersonnel);
});

router.get('/:id', async (req, res) => {
  const infoPersonnel = await InfoPersonnel.findById(req.params.id);
  if(!infoPersonnel) return res.status(404).send('les informations personnels avec cette id n\'existent pas');
  res.send(infoPersonnel);
});

module.exports = router;