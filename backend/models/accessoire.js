const mongoose = require("mongoose");
const Joi = require("joi");

const accessoireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  image: {
    type: String,
    // minlength: 5,
    // maxlength: 255,
  },
});

const Accessoire = mongoose.model("Accessoire", accessoireSchema);

function validateAccessoire(accessoire) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    image: Joi.string().min(5).max(255),
  });

  return schema.validate(accessoire);
}

exports.accessoireSchema = accessoireSchema;
exports.Accessoire = Accessoire;
exports.validate = validateAccessoire;
