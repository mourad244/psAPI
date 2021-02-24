const mongoose = require("mongoose");
const express = require("express");
const { ProductType, validate } = require("../models/productType");
const { ProductCategorie } = require("../models/productCategorie");
const auth = require("../middleware/auth");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
// const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  const productsType = await ProductType.find()
    .populate("categorie", "name")
    .select("-__v")
    .sort("name");
  res.send(productsType);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);

    const { error } = validate(req.body);
    if (error) {
      deleteImages(req.files);
      return res.status(400).send(error.details[0].message);
    }

    const productCategorie = await ProductCategorie.findById(
      req.body.categorie
    );
    if (!productCategorie) {
      deleteImages(req.files);
      return res.status(400).send("Invalid categorie product.");
    }

    let filtered = {};
    for (let item in req.files) {
      filtered[item] = req.files[item];
    }

    const { name, description, categorie } = req.body;
    const { image: images } = filtered;
    const productType = new ProductType({
      name: name,
      description: description,
      categorie: categorie,
      images: images ? images.map((file) => file.path) : [],
    });

    await productType.save();
    res.send(productType);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the image: ${req.files.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImages(req, res);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productCategorie = await ProductCategorie.findById(req.body.categorie);
  if (!productCategorie)
    return res.status(400).send("Invalid categorie product.");

  const productType = await ProductType.findOne({ _id: req.params.id });
  let filtered = {};
  for (let item in req.files) {
    filtered[item] = req.files[item];
  }

  const { name, description, categorie } = req.body;
  const { image: images } = filtered;

  if (name) productType.name = name;
  if (description) productType.description = description;
  if (categorie) productType.categorie = categorie;
  if (images) productType.images.push(...images.map((file) => file.path));

  await productType.save();
  if (!productType)
    return res
      .status(404)
      .send("le type de ce produit avec cette id n'existe pas.");
  res.send(productType);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const productType = await ProductType.findById(req.params.id)
    .populate("products", "name images")
    .select("-__v");

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

router.delete("/:id", auth, async (req, res) => {
  const productType = await ProductType.findByIdAndRemove(req.params.id);
  if (productType.images) deleteImages(productType.images);

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

module.exports = router;
