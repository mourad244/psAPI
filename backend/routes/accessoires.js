const { Accessoire, validate} = require('../models/accessoire');
const mongoose = require('mongoose');
const express = require('express');
const { CategorieRadio } = require('../models/categorieRadio');
const router = express.Router();

router.get('/',async (req, res) => {
  const accessoires = await Accessoire
    .find()
    .populate('categorieRadio', ' nom bande -_id')
    .sort('nom');
  res.send(accessoires);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const categorieRadio = await CategorieRadio.findById(req.body.categorieRadio);
  if(!categorieRadio) return res.status(400).send('categorie radio invalide.');


  const accessoire = new Accessoire({
    categorieRadio: {
      _id: categorieRadio._id,
      nom: categorieRadio.nom,
    },
    nom: req.body.nom
  });
  await accessoire.save();
  res.send(accessoire);
});

router.get('/:id', async (req, res) => {
  const accessoire = await Accessoire.findById(req.params.id);
  if(!accessoire) return res.status(404).send('l\'accessoire avec cette id n\'existe pas');
  res.send(accessoire);
});

module.exports = router;