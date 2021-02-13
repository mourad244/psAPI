const Joi = require("joi");
const mongoose = require("mongoose");

const schemaAvi = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  note: Number,
  comment: {
    type: String,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Avi = mongoose.model("Avi", schemaAvi);
function validateAvi(avi) {
  const schema = Joi.object({
    // client: client,
    note: Joi.number(),
    comment: Joi.string(),
    product: Joi.objectId(),
  });
  return schema.validate(avi);
}
exports.schemaAvi = schemaAvi;
exports.Avi = Avi;
exports.validateAvi = validateAvi;
