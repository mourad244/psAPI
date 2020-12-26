const mongoose = require('mongoose');
const Joi = require('joi');

const SuiviMateriel = mongoose.model('SuiviMateriel', new mongoose.Schema({
  militaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Militaire',
    required: true
  },
  
  materiel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materiel',
    required: true
  },
  dateMouvement: {
    type: Date,
    required: true,
  },
  emplacement: {
    type: String,
    required: true
  },
  raison: {
    type: String
  }
}));

function validateSuiviMateriel(suiviMateriel) {
  const schema = Joi.object({
    militaire: Joi.objectId().required(),
    materiel: Joi.objectId().required(),
    dateMouvement: Joi.date().required(),
    emplacement: Joi.string().required(),
  });
  return schema.validate(suiviMateriel);
}

exports.SuiviMateriel = SuiviMateriel;
exports.validate = validateSuiviMateriel;