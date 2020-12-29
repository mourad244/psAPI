const Joi = require("joi");
const mongoose = require("mongoose");
const Avi = mongoose.model(
  "Avis",
  new mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    note: Number,
    comment: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  })
);

function validateAvi(avi) {
  // const client = Joi.object().keys({
  //   name: Joi.string().min(3).max(255).required(),
  //   email: Joi.string().min(3).max(255).required(),
  // });

  const schema = Joi.object({
    // client: client,
    note: Joi.number(),
    comment: Joi.string(),
    product: Joi.objectId(),
  });
  return schema.validate(avi);
}

exports.Avi = Avi;
exports.validateAvi = validateAvi;
