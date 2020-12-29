const { ProductCategorie, validate } = require("../models/productCategorie");
// const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/" /* , auth */, async (req, res) => {
  const productsCategorie = await ProductCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(productsCategorie);
});

router.post("/" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let productCategorie = new ProductCategorie({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });
  productCategorie = await productCategorie.save();

  res.send(productCategorie);
});

router.put("/:id" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const productCategorie = await ProductCategorie.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
    },
    { new: true }
  );

  if (!productCategorie)
    return res
      .status(404)
      .send(" la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.delete("/:id" /* , auth */, async (req, res) => {
  const productCategorie = await ProductCategorie.findByIdAndRemove(
    req.params.id
  );

  if (!productCategorie)
    return res
      .status(404)
      .send("la categorie produit avec cette id n'existe pas.");

  res.send(productCategorie);
});

router.get("/:id" /* , auth */, async (req, res) => {
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
