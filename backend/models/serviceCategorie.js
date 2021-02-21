const mongoose = require("mongoose");
const Joi = require("joi");

const serviceCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  smallDesc: {
    type: String,
    maxlength: 255,
  },
  largeDesc: {
    type: Array,
  },
  assistance: {
    type: Array,
  },
  images: {
    type: Array,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Service",
    },
  ],
});
const ServiceCategorie = mongoose.model("CategorieSvc", serviceCategorieSchema);

function validateServiceCategorie(categorieSvc) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    smallDesc: Joi.string().max(255).allow(""),
    largeDesc: Joi.array().items(Joi.string()),
    images: Joi.array(),
    assistance: Joi.array().items(Joi.string()),
    services: Joi.array().items(Joi.objectId()),
  });
  return schema.validate(categorieSvc);
}

exports.categorieSvcSchema = serviceCategorieSchema;
exports.ServiceCategorie = ServiceCategorie;
exports.validate = validateServiceCategorie;
