const express = require("express");
const { ProductCategorie, validate } = require("../models/productCategorie");
const auth = require("../middleware/auth");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");

const pathFilteredFiles = require("../middleware/pathFilteredFiles");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const productsCategorie = await ProductCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(productsCategorie);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImages(req, res);

    const { error } = validate(req.body);
    if (error) {
      deleteImages(req.files);
      return res.status(400).send(error.details[0].message);
    }

    let filtered = {};
    for (let item in req.files) {
      filtered[item] = req.files[item];
    }

    const { name, description } = req.body;
    const { image: images } = filtered;
    const productCategorie = new ProductCategorie({
      name: name,
      description: description,
      // images: req.files != undefined ? req.files.path : "",
      images: images ? images.map((file) => file.path) : [],
    });

    await productCategorie.save();
    res.send(productCategorie);
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

  const productCategorie = await ProductCategorie.findOne({
    _id: req.params.id,
  });

  let filtered = {};
  for (let item in req.files) {
    filtered[item] = req.files[item];
  }

  const { name, description } = req.body;
  const { image: images } = filtered;

  if (name) productCategorie.name = name;
  if (description) productCategorie.description = description;
  if (images) productCategorie.images.push(...images.map((file) => file.path));
  await productCategorie.save();

  if (!productCategorie)
    return res
      .status(404)
      .send(" la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const productCategorie = await ProductCategorie.findById(
    req.params.id
  ).select("-__v");

  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.delete("/:id", auth, async (req, res) => {
  const productCategorie = await ProductCategorie.findByIdAndRemove(
    req.params.id
  );
  if (productCategorie.images) deleteImages(productCategorie.images);
  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

module.exports = router;
