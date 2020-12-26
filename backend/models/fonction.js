const mongoose = require('mongoose');
const Joi = require('joi');

const fonctionSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    enum: ['operateurSaisi','secretaire','magazinier', 'operateurRadio','centraliste', 'conducteur','estafette','radariste']
  },
});
const Fonction = mongoose.model('Fonction', fonctionSchema); 

function validateFonction(fonction) {
  const schema = Joi.object({
    nom: Joi.string().valid('operateurSaisi','secretaire','magazinier', 'operateurRadio','centraliste', 'conducteur','estafette','radariste').required(),
  });
  return schema.validate(fonction);
}

exports.fonctionSchema = fonctionSchema;
exports.Fonction = Fonction;
exports.validate = validateFonction;