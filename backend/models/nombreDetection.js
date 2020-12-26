const mongoose = require('mongoose');
const Joi = require('joi');

const NombreDetection = mongoose.model('NombreDetection', new mongoose.Schema({
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },  
  date: {
    type: Date,
    required: true,
  },
  pieton :{
    type: Number,
    required: true,
    default: 0
  },
  dromadaire :{
    type: Number,
    required: true,
    default: 0
  },
  vehiculeLeger :{
    type: Number,
    required: true,
    default: 0
  },
  vehiculeLourd :{
    type: Number,
    required: true,
    default: 0
  },
  convoi :{
    type: Number,
    required: true,
    default: 0
  },
  animal:{
    type: Number,
    required: true,
    default: 0
  },
  NI :{
    type: Number,
    required: true,
    default: 0
  },
})); 

function validateNombreDetection(nombreDetection) {
  const schema = Joi.object({
    station: Joi.objectId().required(),
    date: Joi.date().iso().required(),
    pieton: Joi.number(),
    dromadaire: Joi.number(),
    vehiculeLeger: Joi.number(),
    vehiculeLourd: Joi.number(),
    animal: Joi.number(),
    NI: Joi.number()
  });
  return schema.validate(nombreDetection);
}

exports.NombreDetection = NombreDetection;
exports.validate = validateNombreDetection;