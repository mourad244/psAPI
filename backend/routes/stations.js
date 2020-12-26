const { Station,validate } = require('../models/station');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/',async (req, res) => {
  const stations = await Station
    .find()
    .select('nom uniteImplantation surMirador -_id')
    .sort('nom');
  res.send(stations);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const station = new Station({
    nom: req.body.nom,
    uniteImplantation: req.body.uniteImplantation,
    surMirador: req.body.surMirador
  });
  await station.save();
  res.send(station);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const station = await Station.findByIdAndUpdate(req.params.id, { nom: req.body.nom}, {
    new: true
  })
  
  if(!station) return res.status(404).send('la station avec le dit identifiant n\'existe pas');
  res.send(station);
});

router.get('/:id', async (req, res) => {
  const station = await Station.findById(req.params.id);
  if(!station) return res.status(404).send('la station avec cette id n\'existe pas');
  res.send(station);
});

module.exports = router;