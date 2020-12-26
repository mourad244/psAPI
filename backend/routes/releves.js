const { Releve, validate} = require('../models/releve');
const { Militaire } = require('../models/militaire');
const mongoose = require('mongoose');
const express = require('express');
const { Station } = require('../models/station');

const router = express.Router();

router.get('/',async (req, res) => {
  const releve = await Releve
    .find()
    .populate('militaire', 'grade nom prenom -_id')
    .populate('station', 'nom -_id')
    .sort('dateAffectation');
  res.send(releve);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const militaire = await Militaire.findById(req.body.militaire);
  if(!militaire) return res.status(400).send('Militaire Invalide.');

  const station = await Station.findById(req.body.station);
  if(!station) return res.status(400).send('Station Invalide');

  const releve = new Releve({
    militaire: {
      _id: militaire._id,
      nom: militaire.nom
    },
    station: {
      _id: station._id,
      nom: station.nom
    },
    dateAffectation: req.body.dateAffectation,
    dateSortie: req.body.dateSortie
  });
  await releve.save();
  res.send(releve);
});

router.get('/:id', async (req, res) => {
  const releve = await Releve.findById(req.params.id);
  if(!releve) return res.status(404).send('la releve avec cette id n\'existe pas');
  res.send(releve);
});

module.exports = router;