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
  image: {
    type: String,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productType",
    required: true,
  },
  description: {
    type: String,
    minlength: 3,
  },
  commands: {
    type: Array,
  },
  avis: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "avi",
    },
  ],
});

const Product = mongoose.model("product", productSchema);

function validateProduct(product) {
  console.log(product);
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    type: Joi.objectId().required(),
    image: Joi.string().min(5).max(255),
    description: Joi.string().min(3),
  });

  return schema.validate(product);
}

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;
