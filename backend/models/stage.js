const mongoose = require('mongoose');
const Joi = require('joi');

const stageSchema= new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    enum: ['CAT1','CAT2','BS','BE','BCM']
  },
});
const Stage= mongoose.model('Stage', stageSchema); 

function validateStage(stage) {
  const schema = Joi.object({
    nom: Joi.string().valid('CAT1','CAT2','BS','BE','BCM').required()
  });
  return schema.validate(stage);
}

exports.stageSchema = stageSchema;
exports.Stage = Stage;
exports.validate = validateStage;