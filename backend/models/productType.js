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
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Product",
    },
  ],
});

const ProductType = mongoose.model("ProductType", productTypeSchema);

function validateProductType(productType) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    images: Joi.array().allow(null),
    description: Joi.string().max(255).allow(""),
    categorie: Joi.objectId().required(),
    products: Joi.array().items(Joi.objectId()),
  });
  return schema.validate(productType);
}
exports.productTypeSchema = productTypeSchema;
exports.ProductType = ProductType;
exports.validate = validateProductType;
