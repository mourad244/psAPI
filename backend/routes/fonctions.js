const {Fonction, validate} = require('../models/fonction');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { 
  const fonctions = await Fonction.find().sort('nom');
  res.send(fonctions);
});  

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fonction = new Fonction({
    nom: req.body.nom
  });
  await fonction.save();
  res.send(fonction);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const fonction = await Fonction.findByIdAndUpdate(req.params.id, { nom: req.body.nom}, {
    new: true
  })
  
  if(!fonction) return res.status(404).send('la fonction avec le dit idenfiant n\'existe pas');
  res.send(fonction);
});

router.get('/:id', async (req, res) => {
  const fonctions = await Fonction.findById(req.params.id);
  if (!fonctions) return res.status(404).send('la fonction avec le dit idenfiant n\'existe pas');
  res.send(fonctions);
});

module.exports = router;