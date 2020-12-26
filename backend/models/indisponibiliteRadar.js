const mongoose = require('mongoose');
const Joi = require('joi');

const IndispoRadar = mongoose.model('IndispoRadar', new mongoose.Schema({

  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  dateArret: {
    type: Date,
    required: true,
  },
  dateReprise: {
    type: Date
  },
  cause: {
    type: String
  }
}));

function validateIndispoRadar(indispoRadar) {
  const schema = Joi.object({
    station: Joi.objectId().required(),
    dateArret: Joi.date().iso().required(),
    dateReprise: Joi.date().iso()
  });
  return schema.validate(indispoRadar);
}

exports.IndispoRadar = IndispoRadar;
exports.validate = validateIndispoRadar;