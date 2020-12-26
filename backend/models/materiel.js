const mongoose = require('mongoose');
const Joi = require('joi');

const materielSchema= new mongoose.Schema({
  numeroSerie: {
    type: Number
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorieRadio',
    required: true
  },
});
const Materiel= mongoose.model('Materiel', materielSchema); 

function validateMateriel(materiel) {
  const schema = Joi.object({
    numeroSerie: Joi.number(),
    categorie: Joi.objectId().required()
  });
  return schema.validate(materiel);
}

exports.materielSchema = materielSchema;
exports.Materiel = Materiel;
exports.validate = validateMateriel;