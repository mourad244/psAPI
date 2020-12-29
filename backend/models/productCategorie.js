const mongoose = require("mongoose");
const Joi = require("joi");

const productCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 5,
    required: true,
  },
  image: {
    type: String,
  },
});

const ProductCategorie = mongoose.model(
  "productCategorie",
  productCategorieSchema
);

function validateCategorieProduit(productCategorie) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(255).required(),
    image: Joi.string().min(5).max(255),
  });
  return schema.validate(productCategorie);
}

exports.productCategorieSchema = productCategorieSchema;
exports.ProductCategorie = ProductCategorie;
exports.validate = validateCategorieProduit;
