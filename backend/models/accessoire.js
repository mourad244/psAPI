const mongoose = require("mongoose");
const Joi = require("joi");

const accessoireSchema = new mongoose.Schema({
  image: {
    type: String,
    // minlength: 5,
    // maxlength: 255,
  },
});

const Accessoire = mongoose.model("Accessoire", accessoireSchema);

function validateAccessoire(accessoire) {
  const schema = Joi.object({
    image: Joi.string().min(5).max(255),
  });

  return schema.validate(accessoire);
}

exports.accessoireSchema = accessoireSchema;
exports.Accessoire = Accessoire;
exports.validate = validateAccessoire;
