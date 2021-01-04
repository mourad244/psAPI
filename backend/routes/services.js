const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const { Service, validate } = require("../models/service");
const { CategorieSvc } = require("../models/categorieSvc");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { Accessoire } = require("../models/accessoire");
const uploadImages = require("../middleware/uploadImages");

const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const services = await Service.find()
    .populate("accessoires", "-__v")
    .populate("categorie", "name")
    .select("-__v")
    .sort("name");
  res.send(services);
});

router.post("/" /* , [auth] */, async (req, res) => {
  try {
    await uploadImages(req, res);
    console.log();

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const accessoires = await Accessoire.find({
      _id: { $in: req.body.accessoires },
    });
    if (!accessoires) return res.status(400).send("Invalid accessoires.");

    const categorieSvc = await CategorieSvc.findById(req.body.categorie);
    if (!categorieSvc)
      return res.status(400).send("Invalid categorie service.");

    const service = new Service({
      name: req.body.name,
      caracteristiques: req.body.caracteristiques,
      images: req.files.map((file) => file.path),
      accessoires: accessoires,
      categorie: {
        _id: categorieSvc._id,
      },
    });
    await service.save();
    res.send(service);
  } catch (error) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
});

router.put("/:id" /* , [auth] */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const accessoires = await Accessoire.find({
    _id: { $in: req.body.accessoires },
  });
  if (!accessoires) return res.status(400).send("Invalid accessoires.");

  const categorieSvc = await CategorieSvc.findById(req.body.categorie);
  if (!categorieSvc) return res.status(400).send("Invalid categorie service.");

  const service = await Service.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      caracteristiques: req.body.caracteristiques,
      images: req.body.images,
      accessoires: accessoires,
      categorie: {
        _id: categorieSvc._id,
      },
      // categorie: {
      //   _id: categorieSvc._id,
      //   name: categorieSvc.name,
      // },
    },
    { new: true }
  );

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.delete("/:id" /* , [auth, admin] */, async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate("accessoires", "-__v")
    .populate("categorie", "name")
    .select("-__v");

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

module.exports = router;
