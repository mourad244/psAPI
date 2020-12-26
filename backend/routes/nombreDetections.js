const { NombreDetection, validate} = require('../models/nombreDetection');
const mongoose = require('mongoose');
const express = require('express');
const { Station } = require('../models/station');
const router = express.Router();

router.get('/',async (req, res) => {
  const nombreDetections = await NombreDetection
    .find()
    .populate('station', 'nom uniteImplantation -_id')
    .sort('date');
  res.send(nombreDetections);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const station = await Station.findById(req.body.station);
  if(!station) return res.status(400).send('station Invalide.');


  const nombreDetection = new NombreDetection({
    station: {
      _id: station._id,
      nom: station.nom,
    },
    date: req.body.date,
    pieton: req.body.pieton,
    dromadaire: req.body.dromadaire,
    vehiculeLeger: req.body.vehiculeLeger,
    vehiculeLourd: req.body.vehiculeLoud,
    convoi: req.body.convoi,
    animal: req.body.animal,
    NI: req.body.NI
  });
  await nombreDetection.save();
  res.send(nombreDetection);
});

router.get('/:id', async (req, res) => {
  const nombreDetection = await NombreDetection.findById(req.params.id);
  if(!nombreDetection) return res.status(404).send('l\'identifiant des detections entré n\'existe pas');
  res.send(nombreDetection);
});

module.exports = router;