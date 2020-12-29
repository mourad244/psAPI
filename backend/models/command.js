const Joi = require("joi");
const mongoose = require("mongoose");
const Command = mongoose.model(
  "Commands",
  new mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    numberArticle: {
      type: Number,
      required: true,
    },
  })
);

function validateCommand(command) {
  const schema = Joi.object({
    client: Joi.objectId().required(),
    product: Joi.objectId().required(),
    message: Joi.string(),
    numberArticle: Joi.number().required(),
  });
  return schema.validate(command);
}

exports.Command = Command;
exports.validate = validateCommand;
