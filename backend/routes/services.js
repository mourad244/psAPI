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
    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload an image!" });
    }

    const { error } = validate(req.body);
    if (error) {
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

    const { name, caracteristiques, desc1, desc2, categorie } = req.body;
    console.log(_.filter(req.files, { fieldname: "image" }).path);
    const service = new Service({
      name: name,
      caracteristiques: caracteristiques,
      desc1: desc1,
      desc2: desc2,

      images: req.files.path,
      accessoires: accessoires,
      categorie: categorie,
    });

    await service.save();
    res.send(service);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.file.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImages(req, res);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const serviceCategorie = await ServiceCategorie.findById(req.body.categorie);
  if (!serviceCategorie)
    return res.status(400).send("Invalid categorie service.");

  const service = await Service.findOne({ _id: req.params.id });
  if (req.files) {
    service.images.push(..._.map(req.files, "path"));
  }
  const { name, caracteristiques, accessoires } = req.body;

  service.name = name;
  service.categorie = serviceCategorie;

  if (caracteristiques) service.caracteristiques.push(...caracteristiques);

  if (accessoires) {
    const accessoires = await Accessoire.find({
      _id: { $in: req.body.accessoires },
    });
    if (!accessoires) return res.status(400).send("Invalid accessoires.");

    service.accessoires.push(...accessoires);
  }
  await service.save();

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.delete("/:id", auth, async (req, res) => {
  const service = await Service.findByIdAndRemove(req.params.id);
  service.images.forEach((image) => fs.unlinkSync(image));
  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate("Accessoire", "-__v")
    .populate("Categorie", "name")
    .select("-__v");

  if (!service)
    return res.status(404).send("The service with the given ID was not found.");

  res.send(service);
});

module.exports = router;
