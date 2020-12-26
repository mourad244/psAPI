const { CategorieRadio,validate } = require('../models/categorieRadio');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/',async (req, res) => {
  const categoriesRadio = await CategorieRadio
    .find()
    .select('nom bande')
    .sort('bande');
  res.send(categoriesRadio);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const categorieRadio = new CategorieRadio({
    nom: req.body.nom,
    bande: req.body.bande
  });
  await categorieRadio.save();
  res.send(categorieRadio);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const categorieRadio = await CategorieRadio.findByIdAndUpdate(req.params.id, { nom: req.body.nom}, {
    new: true
  })
  
  if(!categorieRadio) return res.status(404).send('la categorie avec cet identifiant n\'existe pas');
  res.send(categorieRadio);
});

router.get('/:id', async (req, res) => {
  const categorieRadio = await CategorieRadio.findById(req.params.id);
  if(!categorieRadio) return res.status(404).send('la categorie avec cette id n\'existe pas');
  res.send(categorieRadio);
});

module.exports = router;