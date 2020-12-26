const mongoose = require('mongoose');
const Joi = require('joi');

const categorieRadioSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  bande:{
    type: String,
    required: true
  }
});
const CategorieRadio = mongoose.model('CategorieRadio', categorieRadioSchema); 

function validateCategorieRadio(categorie) {
  const schema = Joi.object({
    nom: Joi.string().required(),
    bande: Joi.string().required(),
  });
  return schema.validate(categorie);
}

exports.categorieRadioSchema = categorieRadioSchema;
exports.CategorieRadio = CategorieRadio;
exports.validate = validateCategorieRadio;