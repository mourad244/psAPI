const mongoose = require("mongoose");
const Joi = require("joi");

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  images: {
    type: Array,
  },
  description: {
    type: String,
    maxlength: 255,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategorie",
    required: true,
  },
});

const ProductType = mongoose.model("ProductType", productTypeSchema);

function validateProductType(productType) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    images: Joi.array(),
    description: Joi.string().max(255),
    categorie: Joi.objectId().required(),
  });

  return schema.validate(productType);
}
exports.productTypeSchema = productTypeSchema;
exports.ProductType = ProductType;
exports.validate = validateProductType;
