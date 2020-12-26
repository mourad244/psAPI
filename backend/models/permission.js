// const {militaireSchema} = require('./militaire');
const mongoose = require("mongoose");
const Joi = require("joi");

// var now = moment();

const Permission = mongoose.model(
  "Permission",
  new mongoose.Schema({
    militaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Militaire",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["detente", "exceptionnelle"],
    },
    dateDepart: {
      type: Date,
      required: true,
    },
    dateArrivee: {
      type: Date,
    },
  })
);

function validatePermission(permission) {
  const schema = Joi.object({
    militaire: Joi.objectId(),
    type: Joi.string().valid("detente", "exceptionnelle").required(),
    dateDepart: Joi.date().iso().required(),
    dateArrivee: Joi.date().iso(),
  });
  return schema.validate(permission);
}

exports.Permission = Permission;
exports.validate = validatePermission;
