const mongoose = require("mongoose");
const Joi = require("joi");

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    default: null,

    maxlength: 255,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productCategorie",
    required: true,
  },
});

const ProductType = mongoose.model("productType", productTypeSchema);

function validateProductType(productType) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    image: Joi.string(),
    description: Joi.string().allow(null, "").max(255),
    categorie: Joi.objectId().required(),
  });

  return schema.validate(productType);
}
exports.productTypeSchema = productTypeSchema;
exports.ProductType = ProductType;
exports.validate = validateProductType;
