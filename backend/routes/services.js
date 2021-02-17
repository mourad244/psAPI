const mongoose = require("mongoose");
const express = require("express");
const { Service, validate } = require("../models/service");
const { ServiceCategorie } = require("../models/serviceCategorie");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res) => {
  const services = await Service.find()
    .populate("categorie", "name")
    .select("-__v")
    .sort("name");
  res.send(services);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);
    const { error } = validate(req.body);
    if (error) {
      console.log(error);
      deleteImages(req.files);
      return res.status(400).send(error.details[0].message);
    }

    const serviceCategorie = await ServiceCategorie.findById(
      req.body.categorie
    );

    if (!serviceCategorie) {
      deleteImages(req.files);
      return res.status(400).send("Invalid categorie service.");
    }

    let filtered = {};
    for (let item in req.files) {
      filtered[item] = req.files[item];
    }

    const { name, caracteristiques, desc1, desc2, categorie } = req.body;
    const { image: images, accessoire: accessoires } = filtered;
    const service = new Service({
      name: name,
      caracteristiques: caracteristiques,
      desc1: desc1,
      desc2: desc2,

      images: images ? images.map((file) => file.path) : [],
      accessoires: accessoires ? accessoires.map((file) => file.path) : [],
      categorie: categorie,
    });

    await service.save();
    res.send(service);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImages(req, res);
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const serviceCategorie = await ServiceCategorie.findById(req.body.categorie);
  if (!serviceCategorie)
    return res.status(400).send("Invalid categorie service.");

  const service = await Service.findOne({ _id: req.params.id });

  let filtered = {};
  for (let item in req.files) {
    filtered[item] = req.files[item];
  }

  const { name, desc1, desc2, caracteristiques } = req.body;
  const { image: images, accessoire: accessoires } = filtered;

  service.name = name;
  service.desc1 = desc1;
  service.desc2 = desc2;
  service.categorie = serviceCategorie;
  if (caracteristiques) {
    service.caracteristiques = caracteristiques;
  }
  if (images) service.images.push(images.map((file) => file.path));
  if (accessoires)
    service.accessoires.push(accessoires.map((file) => file.path));
  await service.save();

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const service = await Service.findById(req.params.id)
    // .populate("Categorie", "name")
    .select("-__v");

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.delete("/:id", auth, async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);
  if (service.images) deleteImages(service.images);
  if (service.accessoires) deleteImages(service.accessoires);
  // if (!service)
  //   return res.status(404).send("The service with the given ID was not found.");

  // res.send(service);
});

module.exports = router;
