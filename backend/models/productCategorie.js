const mongoose = require("mongoose");
const Joi = require("joi");

const productCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  images: {
    type: Array,
  },
});

const ProductCategorie = mongoose.model(
  "ProductCategorie",
  productCategorieSchema
);

function validateCategorieProduit(productCategorie) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    images: Joi.array(),
    description: Joi.string().min(3).max(255),
  });
  return schema.validate(productCategorie);
}

exports.productCategorieSchema = productCategorieSchema;
exports.ProductCategorie = ProductCategorie;
exports.validate = validateCategorieProduit;
