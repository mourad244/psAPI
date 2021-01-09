const mongoose = require("mongoose");
const moment = require("moment");
const express = require("express");
const { ProductType, validate } = require("../models/productType");
const { ProductCategorie } = require("../models/productCategorie");
const auth = require("../middleware/auth");
const uploadImage = require("../middleware/uploadImage");
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
    await uploadImage(req, res);

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const productCategorie = await ProductCategorie.findById(
      req.body.categorie
    );
    if (!productCategorie)
      return res.status(400).send("Invalid categorie product.");

    const { name, description, categorie } = req.body;
    const productType = new ProductType({
      name: name,
      description: description,
      categorie: categorie,
      image: req.file != undefined ? req.file.path : "",
    });
    await productType.save();
    res.send(productType);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the image: ${req.file.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImage(req, res);

  const { error } = validate(req.body);

  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  const productType = await ProductType.findOne({ _id: req.params.id });

  if (req.file) {
    if (productType.image) fs.unlinkSync(productType.image);
    productType.image = req.file.path;
  }

  const { name, description, categorie } = req.body;
  if (name) {
    productType.name = name;
  }
  if (description) productType.description = description;

  if (categorie) {
    const productCategorie = await ProductCategorie.findById(
      req.body.categorie
    );
    if (!productCategorie)
      return res.status(400).send("Invalid categorie product.");
    productType.categorie = categorie;
  }
  await productType.save();

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

router.delete("/:id", auth, async (req, res) => {
  if (productType.image) fs.unlinkSync(productType.image);
  const productType = await ProductType.findByIdAndRemove(req.params.id);

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const productType = await ProductType.findById(req.params.id)
    .populate("categorie", "name")
    .select("-__v");

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

module.exports = router;
