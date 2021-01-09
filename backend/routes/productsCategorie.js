const { ProductCategorie, validate } = require("../models/productCategorie");
const auth = require("../middleware/auth");
const express = require("express");
const uploadImage = require("../middleware/uploadImage");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  const productsCategorie = await ProductCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(productsCategorie);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImage(req, res);

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const productCategorie = new ProductCategorie({
      name: req.body.name,
      description: req.body.description,
      image: req.file != undefined ? req.file.path : "",
    });
    await productCategorie.save();

    res.send(productCategorie);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the image: ${req.file.originalname}. ${err}`,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  await uploadImage(req, res);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productCategorie = await ProductCategorie.findOne({
    _id: req.params.id,
  });

  if (req.file) {
    if (productCategorie.image) fs.unlinkSync(productCategorie.image);
    productCategorie.image = req.file.path;
  }
  const { name, description } = req.body;
  if (name) productCategorie.name = name;
  if (description) productCategorie.description = description;

  await productCategorie.save();

  if (!productCategorie)
    return res
      .status(404)
      .send(" la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.delete("/:id", auth, async (req, res) => {
  const productCategorie = await ProductCategorie.findByIdAndRemove(
    req.params.id
  );
  if (productCategorie.image) fs.unlinkSync(productCategorie.image);
  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.get("/:id", async (req, res) => {
  const productCategorie = await ProductCategorie.findById(
    req.params.id
  ).select("-__v");

  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

module.exports = router;
