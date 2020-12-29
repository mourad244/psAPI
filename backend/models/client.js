const Joi = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Client = mongoose.model("Client", clientSchema);
// clientSchema.index({ email: 1 }, { unique: true, sparse: true });

function validateClient(client) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(client);
}

exports.clientSchema = clientSchema;
exports.Client = Client;
exports.validateClient = validateClient;
