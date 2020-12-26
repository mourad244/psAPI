const mongoose = require('mongoose');
const Joi = require('joi');

const StageEffectue = mongoose.model('StageEffectue', new mongoose.Schema({
  stage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: true
  },
  militaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Militaire',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date
  }
}));

function validateStageEffectue(stageEffectue) {
  const schema = Joi.object({
    stage: Joi.objectId(),
    militaire: Joi.objectId(),
    dateDebut: Joi.date().required(),
    dateFin: Joi.date().required()
  });
  return schema.validate(stageEffectue);
}

exports.StageEffectue = StageEffectue;
exports.validate = validateStageEffectue;