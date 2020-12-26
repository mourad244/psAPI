const mongoose = require('mongoose');
const Joi = require('joi');

const InfoPersonnel = mongoose.model('InfoPersonnel', new mongoose.Schema({
  militaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Militaire',
    required: true
  },
  cin: {
    type: String,
    required: true,
  },
  mutuelle: {
    type: String
  },
  adresse: {
    type: String,
    required: true
  }, 
  dateNaissance: {
    type: Date,
    required: true
  },
  telephone: {
    type: Number,
    required: true
  }
}));

function validateInfoPersonnel(infoPersonnel) {
  const schema = Joi.object({
    militaire: Joi.objectId(),
    cin: Joi.string().min(3).max(10).required(),
    mutuelle: Joi.string().min(3).max(10).required(),
    adresse: Joi.string().min(3).max(255).required(),
    dateNaissance: Joi.date().iso().required(),
    telephone: Joi.number().required()
  });
  return schema.validate(infoPersonnel);
}

exports.InfoPersonnel = InfoPersonnel;
exports.validate = validateInfoPersonnel;