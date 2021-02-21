const express = require("express");
const { ServiceCategorie } = require("../models/serviceCategorie");
const auth = require("../middleware/auth");

const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/:id", validateObjectId, async (req, res) => {
  const serviceCategorie = await ServiceCategorie.findOne({
    _id: req.params.id,
  });
});
