const { CategorieSvc, validate } = require("../models/categorieSvc");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const uploadImage = require("../middleware/uploadImage");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res) => {
  const categoriesSvc = await CategorieSvc.find().select("-__v").sort("name");
  res.send(categoriesSvc);
});

router.post("/", auth, async (req, res) => {
  try {
    await uploadImage(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a image!" });
    }

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const categorieSvc = new CategorieSvc({
      name: req.body.name,
      smallDesc: req.body.smallDesc,
      largeDesc: req.body.largeDesc,
      image: req.file.path,
    });
    await categorieSvc.save();

    res.send(categorieSvc);
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

  const categorieSvc = await CategorieSvc.findOne({ _id: req.params.id });

  if (req.file) {
    if (categorieSvc.image) fs.unlinkSync(categorieSvc.image);
    categorieSvc.image = req.file.path;
  }
  const { name, smallDesc, largeDesc } = req.body;
  if (name) categorieSvc.name = name;
  if (smallDesc) categorieSvc.smallDesc = smallDesc;
  if (largeDesc) categorieSvc.largeDesc = largeDesc;

  await categorieSvc.save();

  if (!categorieSvc)
    return res
      .status(404)
      .send(" la categorie service avec cette id n'existe pas.");

  res.send(categorieSvc);
});

router.delete("/:id", auth, async (req, res) => {
  if (categorieSvc.image) fs.unlinkSync(categorieSvc.image);
  const categorieSvc = await CategorieSvc.findByIdAndRemove(req.params.id);

  if (!categorieSvc)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(categorieSvc);
});

router.get("/:id", async (req, res) => {
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
