const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  images: {
    type: Array,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductType",
    required: true,
  },
  description: {
    type: Array,
  },

  avis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Avi",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    type: Joi.objectId().required(),
    images: Joi.array(),
    avis: Joi.array().items(Joi.objectId()),
    description: Joi.array(),
  });

  return schema.validate(product);
}

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;
