const { SuiviMateriel, validate} = require('../models/suiviMateriel');
const { Militaire } = require('../models/militaire');
const mongoose = require('mongoose');
const express = require('express');
const {  Materiel } = require('../models/materiel');
const { CategorieRadio } = require('../models/categorieRadio');

const router = express.Router();

router.get('/',async (req, res) => {
  const suiviMateriel = await SuiviMateriel
    .find()
    .populate('militaire', 'grade nom prenom -_id')
    .populate('materiel', 'numeroSerie -_id')
    .sort('dateMouvement');
  res.send(suiviMateriel);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const militaire = await Militaire.findById(req.body.militaire);
  if(!militaire) return res.status(400).send('Militaire Invalide.');

  const materiel = await Materiel.findById(req.body.materiel);
  if(!materiel) return res.status(400).send('Materiel Invalide');
  
  const categorie = await CategorieRadio.findById(materiel.categorie);
  if(!categorie) return res.status(400).send('categorie Inavlide');

  const suiviMateriel = new SuiviMateriel({
    militaire: {
      _id: militaire._id,
      nom: militaire.nom
    },
    materiel: {
      _id: materiel._id,
      numeroSerie: materiel.numeroSerie,
      categorie : materiel.categorie
    },
    dateMouvement: req.body.dateMouvement,
    emplacement: req.body.emplacement,
    raison: req.body.raison
  });
  await suiviMateriel.save();
  res.send(suiviMateriel);
});

router.get('/:id', async (req, res) => {
  const suiviMateriel = await SuiviMateriel.findById(req.params.id);
  if(!suiviMateriel) return res.status(404).send('le suivi du materiel avec cette id n\'existe pas');
  res.send(suiviMateriel);
});

module.exports = router;