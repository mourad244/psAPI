const mongoose = require("mongoose");
const Joi = require("joi");

const Service = mongoose.model(
  "Service",

  new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    caracteristiques: {
      type: Array,
      trim: true,
    },
    images: {
      type: Array,
    },
    accessoires: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accessoire",
        trim: true,
      },
    ],
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "categorieSvc",
      required: true,
    },
  })
);

function validateAccessoire(accessoire) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    caracteristiques: Joi.array(),
    images: Joi.array(),
    accessoires: Joi.array().items(Joi.objectId()),
    categorie: Joi.objectId().required(),
  });

  return schema.validate(accessoire);
}

exports.Service = Service;
exports.validate = validateAccessoire;
