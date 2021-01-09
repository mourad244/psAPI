const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const { validateAvi, Avi } = require("../models/avi");
const { validateClient, Client } = require("../models/client");
const { ProductType } = require("../models/productType");
const uploadImage = require("../middleware/uploadImage");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("type", "name")
    .populate("producttype", "name")
    .populate("avis", "comment client")
    .select("-__v -commands")
    .sort("name");

  res.send(products);
});

router.put("/:id", auth, async (req, res) => {
  await uploadImage(req, res);

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findOne({ _id: req.params.id });
  if (req.file) {
    fs.unlinkSync(product.image);
    product.image = req.file.path;
  }
  const { name, type, description } = req.body;
  if (name) product.name = name;
  if (type) product.type = type;
  if (description) product.description = description;

  await product.save();

  if (!product)
    return res.status(404).send("le produit avec cette id n'existe pas.");

  res.send(product);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImage(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload an image!" });
    }

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const productType = await ProductType.findById(req.body.type);
    if (!productType) return res.status(400).send("Invalid type of product.");

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      image: req.file.path,
    });

    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the image: ${req.file.originalname}. ${err}`,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  fs.unlinkSync(product.image);

  if (!product)
    return res.status(404).send("le product avec cette id n'existe pas.");

  res.send(product);
});

router.get("/:id" /* , auth */, async (req, res) => {
  const product = await Product.findById(req.params.id).select("-__v");

  if (!product)
    return res.status(404).send("le product avec cette id n'existe pas.");

  res.send(product);
});

router.put("/:id", auth, async (req, res) => {
  await uploadImage(req, res);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productType = await ProductType.findById(req.body.categorie);
  if (!productType) return res.status(400).send("Invalid categorie product.");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      type: productType,
      description: req.body.description,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("le product avec cette id n'existe pas.");

  res.send(product);
});

router.put("/avis/:id", async (req, res) => {
  const { error1 } = validateClient(req.body.client);
  if (error1) return res.status(400).send(error.details[0].message);

  const { error2 } = validateAvi(req.body);
  if (error2) return res.status(400).send(error.details[0].message);

  const client = new Client({
    name: req.body.client.name,
    email: req.body.client.email,
  });

  await client.save();

  const avi = new Avi({
    client: client._id,
    comment: req.body.comment,
    note: req.body.note,
    product: req.params.id,
  });

  const product = await Product.findById(req.params.id);
  product.avis.push(avi._id);
  await avi.save();
  await product.save();
  res.send(avi);
});

router.get("/avis/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const avis = await Avi.find({ _id: { $in: product.avis } })
    .populate("product", "name -_id")
    .select("-__v")
    .sort("note");
  res.send(avis);
});

module.exports = router;
