const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const deviSchema = new mongoose.Schema(
  "Devis",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    objetMessage: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

const Devi = mongoose.model("Devi", deviSchema);

function validateDevi(devi) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required(),
    objetMessage: Joi.string().required(),
    message: Joi.string().required(),
  });
  return schema.validate(devi);
}

exports.Devi = Devi;
exports.validate = validateDevi;
