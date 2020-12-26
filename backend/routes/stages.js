const {Stage, validate} = require('../models/stage');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { 
  const stages = await Stage.find().sort('nom');
  res.send(stages);
});  

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let  stage = new Stage({nom: req.body.nom});
  stage = await stage.save();

  res.send(stage);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const stage = await Stage.findByIdAndUpdate(req.params.id, { nom: req.body.nom}, {
    new: true
  })
  
  if(!stage) return res.status(404).send('le stage avec le dit identifiant n\'existe pas');
  res.send(stage);
});

router.get('/:id', async (req, res) => {
  const stages = await Stage.findById(req.params.id);
  if (!stages) return res.status(404).send('le stage avec le dit identifiant n\'existe pas');
  res.send(stages);
});

module.exports = router;