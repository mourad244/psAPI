const mongoose = require('mongoose');
const Joi = require('joi');

const Releve = mongoose.model('Releve', new mongoose.Schema({
  militaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Militaire',
    required: true
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  dateAffectation: {
    type: Date,
    required: true,
  },
  dateSortie: {
    type: Date
  }
}));

function validateReleve(releve) {
  const schema = Joi.object({
    militaire: Joi.objectId().required(),
    station: Joi.objectId().required(),
    dateAffectation: Joi.date().required(),
    dateSortie: Joi.date()
  });
  return schema.validate(releve);
}

exports.Releve = Releve;
exports.validate = validateReleve;