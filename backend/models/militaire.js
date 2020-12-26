const mongoose = require("mongoose");
const Joi = require("joi");
// const {fonctionSchema} = require('./fonction'); // lorsque on utilise le type embedding

const militaireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  prenom: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  grade: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  mle: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  uniteOrigine: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  fonction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fonction",
  },
});

const Militaire = mongoose.model("Militaire", militaireSchema);
function validateMilitaire(militaire) {
  const schema = Joi.object({
    nom: Joi.string().min(3).max(50).required(),
    prenom: Joi.string().min(3).max(50).required(),
    grade: Joi.required(),
    mle: Joi.string().min(5).max(50).required(),
    fonction: Joi.objectId(),
    uniteOrigine: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(militaire);
}

exports.militaireSchema = militaireSchema;
exports.Militaire = Militaire;
exports.validate = validateMilitaire;
