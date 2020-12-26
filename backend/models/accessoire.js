const mongoose = require('mongoose');
const Joi = require('joi');

const Accessoire = mongoose.model('Accessoire', new mongoose.Schema({
  categorieRadio: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'CategorieRadio',
    required: true
  },
  nom: {
    type: String,
    required: true,
  }
}));

function validateAccessoire(accessoire) {
  const schema = Joi.object({
    categorieRadio: Joi.objectId(),
    nom: Joi.string().required()
  });
  return schema.validate(accessoire);
}

exports.Accessoire = Accessoire;
exports.validate = validateAccessoire;