const mongoose = require('mongoose');
const Joi = require('joi');

const stationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  uniteImplantation: {
    type: String,
    required:true,
  },
  surMirador: {
    type: Boolean,
    required:true,
    default: true
  }
});
const Station = mongoose.model('Station', stationSchema); 

function validateStation(station) {
  const schema = Joi.object({
    nom: Joi.string().required(),
    uniteImplantation: Joi.string().required(),
    surMirador: Joi.boolean().required()
  });
  return schema.validate(station);
}

exports.stationSchema = stationSchema;
exports.Station = Station;
exports.validate = validateStation;