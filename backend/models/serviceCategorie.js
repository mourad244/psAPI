const mongoose = require("mongoose");
const Joi = require("joi");

const serviceCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  smallDesc: {
    type: String,
    minlength: 5,
    required: true,
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
});
const ServiceCategorie = mongoose.model("CategorieSvc", serviceCategorieSchema);

function validateServiceCategorie(categorieSvc) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    smallDesc: Joi.string().min(3).max(255).required(),
    largeDesc: Joi.array().items(Joi.string().min(5)),
    images: Joi.array(),
    assistance: Joi.array().items(Joi.string().min(5)),
  });
  return schema.validate(categorieSvc);
}

exports.categorieSvcSchema = serviceCategorieSchema;
exports.ServiceCategorie = ServiceCategorie;
exports.validate = validateServiceCategorie;
