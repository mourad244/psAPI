const { Materiel, validate} = require('../models/materiel');
const mongoose = require('mongoose');
const express = require('express');
const { CategorieRadio } = require('../models/categorieRadio');
const router = express.Router();

router.get('/',async (req, res) => {
  const materiels = await Materiel
    .find()
    .populate('categorie', 'nom bande -_id')
    .sort('numeroSerie');
  res.send(materiels);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const categorieRadio = await CategorieRadio.findById(req.body.categorie);
  if(!categorieRadio) return res.status(400).send('categorie Invalide.');


  const materiel = new Materiel({
    numeroSerie: req.body.numeroSerie,
    categorie: {
      _id: categorieRadio._id,
      nom: categorieRadio.nom,
      bande: categorieRadio.bande
    },
  });
  await materiel.save();
  res.send(materiel);
});

router.get('/:id', async (req, res) => {
  const materiel = await Materiel.findById(req.params.id);
  if(!materiel) return res.status(404).send('materiel avec cette id n\'existe pas');
  res.send(materiel);
});

module.exports = router;