const express = require("express");
const { ServiceCategorie, validate } = require("../models/serviceCategorie");
const auth = require("../middleware/auth");
const uploadImages = require("../middleware/uploadImages");
const deleteImages = require("../middleware/deleteImages");

const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const serviceCategorie = await ServiceCategorie.find()
    .select("-__v")
    .sort("name");
  res.send(serviceCategorie);
});

/* router.get("/images/:id", (req, res) => {
  res.sendFile("/images/" + `${req.params.id}`);
}); */
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

    const { name, smallDesc, largeDesc, assistance } = req.body;
    const { image: images } = filtered;

    const serviceCategorie = new ServiceCategorie({
      name: name,
      smallDesc: smallDesc,
      largeDesc: largeDesc,
      assistance: assistance,
      images: images ? images.map((file) => file.path) : [],
    });
    await serviceCategorie.save();

    res.send(serviceCategorie);
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

  const serviceCategorie = await ServiceCategorie.findOne({
    _id: req.params.id,
  });

  let filtered = {};
  for (let item in req.files) {
    filtered[item] = req.files[item];
  }

  const { name, smallDesc, largeDesc, assistance } = req.body;

  const { image: images } = filtered;

  if (name) serviceCategorie.name = name;
  if (smallDesc) serviceCategorie.smallDesc = smallDesc;
  if (largeDesc) serviceCategorie.largeDesc = largeDesc;
  if (assistance) serviceCategorie.assistance = assistance;
  if (images) serviceCategorie.images.push(...images.map((file) => file.path));

  await serviceCategorie.save();

  if (!serviceCategorie)
    return res
      .status(404)
      .send(" la categorie service avec cette id n'existe pas.");

  res.send(serviceCategorie);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const serviceCategorie = await ServiceCategorie.findById(req.params.id)
    .populate("services", "name images")
    .select("-__v");
  if (!serviceCategorie)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(serviceCategorie);
});

router.delete("/:id", auth, async (req, res) => {
  const serviceCategorie = await ServiceCategorie.findByIdAndRemove(
    req.params.id
  );

  if (serviceCategorie.images) deleteImages(serviceCategorie.images);
  if (!serviceCategorie)
    return res
      .status(404)
      .send("la categorie service avec cette id n'existe pas.");

  res.send(serviceCategorie);
});

module.exports = router;
