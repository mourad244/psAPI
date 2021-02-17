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
    desc1: {
      type: String,
    },
    desc2: {
      type: String,
    },
    caracteristiques: {
      type: Array,
      trim: true,
    },
    images: {
      type: Array,
      default: [],
    },
    accessoires: {
      type: Array,
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "CategorieSvc",
      required: true,
    },
  })
);

function validateService(service) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    categorie: Joi.objectId().required(),
    desc1: Joi.string().allow(""),
    desc2: Joi.string().allow(""),
    caracteristiques: Joi.array(),
    images: Joi.array(),
    accessoires: Joi.array(),
  });

  return schema.validate(service);
}

exports.Service = Service;
exports.validate = validateService;
