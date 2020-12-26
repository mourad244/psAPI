const { CategorieSvc, validate } = require("../models/categorieSvc");
// const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/" /* , auth */, async (req, res) => {
  const categoriesSvc = await CategorieSvc.find().select("-__v").sort("name");
  res.send(categoriesSvc);
});

router.post("/" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let categorieSvc = new CategorieSvc({
    name: req.body.name,
    smallDesc: req.body.smallDesc,
    largeDesc: req.body.largeDesc,
    image: req.body.image,
  });
  categorieSvc = await categorieSvc.save();

  res.send(categorieSvc);
});

router.put("/:id" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const categorieSvc = await CategorieSvc.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      smallDesc: req.body.smallDesc,
      largeDesc: req.body.largeDesc,
      image: req.body.image,
    },
    { new: true }
  );

  if (!categorieSvc)
    return res
      .status(404)
      .send(" la categorie service avec cette id n'existe pas.");

  res.send(categorieSvc);
});

router.delete("/:id" /* , auth */, async (req, res) => {
  const categorieSvc = await CategorieSvc.findByIdAndRemove(req.params.id);

  if (!categorieSvc)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(categorieSvc);
});

router.get("/:id" /* , auth */, async (req, res) => {
  const categorieSvc = await CategorieSvc.findById(req.params.id).select(
    "-__v"
  );

  if (!categorieSvc)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(categorieSvc);
});

module.exports = router;
