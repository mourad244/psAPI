const { IndispoRadar, validate} = require('../models/indisponibiliteRadar');
const mongoose = require('mongoose');
const express = require('express');
const { Station } = require('../models/station');
const router = express.Router();

router.get('/',async (req, res) => {
  const indisposRadar = await IndispoRadar
    .find()
    .populate('station', 'nom uniteImplantation -_id')
    .sort('jourArret');
  res.send(indisposRadar);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const station = await Station.findById(req.body.station);
  if(!station) return res.status(400).send('station Invalide.');


  const indispoRadar = new IndispoRadar({
    station: {
      _id: station._id,
      nom: station.nom,
    },
    dateArret: req.body.dateArret,
    dateReprise: req.body.dateReprise,
    cause: req.body.cause
  });
  await indispoRadar.save();
  res.send(indispoRadar);
});

router.get('/:id', async (req, res) => {
  const indispoRadar = await IndispoRadar.findById(req.params.id);
  if(!indispoRadar) return res.status(404).send('l\'indisponibilite du radar avec cette id n\'existe pas');
  res.send(indispoRadar);
});

module.exports = router;