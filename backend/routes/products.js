const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const { validateAvi, Avi } = require("../models/avi");
const { validateClient, Client } = require("../models/client");
const { ProductType } = require("../models/productType");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const logger = require("../startup/logging");

const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");

const router = express.Router();

// nested populate
//.populate({
//   path: 'avis',
//   populate: {
//     path: 'avis.client',
//     model: 'Client'
//   }
// })

router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("type", "name")
    .populate("avis", "comment client")
    .select("-__v ")
    .sort("name");

  res.send(products);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);

    const { error } = validate(req.body);
    if (error) {
      deleteImages(req.files);
      return res.status(400).send(error.details[0].message);
    }

    const productType = await ProductType.findById(req.body.type);
    if (!productType) {
      deleteImages(req.files);
      return res.status(400).send("Invalid type of product.");
    }
    let filtered = {};
    for (let item in req.files) {
      filtered[item] = req.files[item];
    }

    const { name, description, type } = req.body;
    const { image: images } = filtered;

    const product = new Product({
      name: name,
      description: description,
      type: type,
      images: images ? images.map((file) => file.path) : [],
    });

    productType.products.push(product._id);

    await product.save();
    await productType.save();
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the images: ${req.files.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImages(req, res);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productType = await ProductType.findById(req.body.type);
  if (!productType) return res.status(400).send("Invalide type of product");

  const product = await Product.findOne({ _id: req.params.id });

  let filtered = {};
  for (let item in req.files) {
    filtered[item] = req.files[item];
  }

  const { name, type, description } = req.body;
  const { image: images } = filtered;

  if (name) product.name = name;
  if (type) product.type = type;
  if (description) product.description = description;
  if (images) product.images.push(...images.map((file) => file.path));

  productType.products.indexOf(req.params.id) === -1
    ? productType.products.push(req.params.id)
    : console.log("This item already exists");
  await productType.save();
  await product.save();

  if (!product)
    return res.status(404).send("le produit avec cette id n'existe pas.");
  res.send(product);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id)
    // .populate("type", "name")
    .select("-__v");

  if (!product)
    return res.status(404).send("le product avec cette id n'existe pas.");

  res.send(product);
});

router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  // if (!product)
  //   return res.status(404).send("le product avec cette id n'existe pas.");
  const productType = await ProductType.findById(product.type);

  const products = productType.products;
  const index = products.indexOf(req.params.id);
  if (index > -1) products.splice(index, 1);
  productType.products = products;
  await productType.save();

  if (product.images) deleteImages(product.images);
  // console.log(product);
  // fs.unlinkSync(product.images);

  // res.send(product);
});

router.put("/avis/:id", async (req, res) => {
  const { error2 } = validateAvi(req.body);

  if (error2) return res.status(400).send(error.details[0].message);

  let client = await Client.findOne({ email: req.body.client });
  if (!client) {
    client = new Client({
      email: req.body.client,
    });

    await client.save();
  }

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
  const avis = await Avi.find({ product: req.params.id })
    .populate("product", "name -_id")
    .populate("client", "email")
    .select("-__v")
    .sort("date");
  res.send(avis);
});

module.exports = router;
