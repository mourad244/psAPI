const mongoose = require("mongoose");
const moment = require("moment");
const express = require("express");
const { ProductType, validate } = require("../models/productType");
const { ProductCategorie } = require("../models/productCategorie");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const productsType = await ProductType.find()
    .populate("categorie", "name")
    .select("-__v")
    .sort("name");
  res.send(productsType);
});

router.post("/" /* , [auth] */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productCategorie = await ProductCategorie.findById(req.body.categorie);
  if (!productCategorie)
    return res.status(400).send("Invalid categorie product.");

  const productType = new ProductType({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    categorie: {
      _id: productCategorie._id,
    },
  });
  await productType.save();
  res.send(productType);
});

router.put("/:id" /* , [auth] */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productCategorie = await ProductCategorie.findById(req.body.categorie);
  if (!productCategorie)
    return res.status(400).send("Invalid categorie product.");

  const productType = await ProductType.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      categorie: {
        _id: productCategorie._id,
      },
    },
    { new: true }
  );

  if (!productType)
    return res
      .status(404)
      .send("The productType with the given ID was not found.");

  res.send(productType);
});

router.delete("/:id" /* , [auth, admin] */, async (req, res) => {
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
