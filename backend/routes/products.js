const mongoose = require("mongoose");
const express = require("express");
const { Product, validate } = require("../models/product");
const { validateAvi, Avi } = require("../models/avi");
const { validateClient, Client } = require("../models/client");
const { ProductType } = require("../models/productType");
const uploadFile = require("../middleware/upload");
const auth = require("../middleware/auth");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/" /* , auth */, async (req, res) => {
  // const directoryPath = "/images/products/";
  // fs.readdir(directoryPath, function (err, file) {
  //   if (err) {
  //     res.status(500).send({
  //       message: "Unable to scan file",
  //     });
  //   }

  //   let fileInfos
  // });
  const products = await Product.find()
    .populate("type", "name")
    .populate("producttype", "name")
    .populate("avis", "comment client")
    .select("-__v -commands")
    .sort("name");

  // res.send(products);
});

//---------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    await uploadFile(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    // res.status(200).send({
    //   message: "Uploaded the file successfully: " + req.file.originalname,
    // });
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const productType = await ProductType.findById(req.body.type);
    if (!productType) return res.status(400).send("Invalid categorie product.");
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      type: { _id: productType._id },
      image: req.file.path,
    });

    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

//--------------------------*****************************

router.delete("/:id" /* , auth */, async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

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

//---------------------- add avis
router.put("/avis/:id" /* , auth */, async (req, res) => {
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

// ---------  command a product  ---------------
// router.put("/commands/:id" /* , auth */, async (req, res) => {
//   const { error1 } = validateClient(req.body.client);
//   if (error1) return res.status(400).send(error.details[0].message);

//   let client = new Client({
//     name: req.body.client.name,
//     email: req.body.client.email,
//   });

//   try {
//     await client.save();
//   } catch (error) {
//     console.log("client déja en base de donnée");
//     client = await Client.find({ email: req.body.client.email });

//     // client = await Client.findById(ancienClient._id);
//     // console.log(ancienClient[0]._id);
//   }

//   newClient = client[0]._id || client._id;

//   const command = new Command({
//     client: newClient,
//     product: req.params.id,
//     message: req.body.message,
//     numberArticle: req.body.numberArticle,
//   });

//   const product = await Product.findById(req.params.id);
//   console.log(product);
//   await command.save();
//   product.commands.push(command._id);

//   await product.save();
//   res.send(command);
// });

// ----------------get all commands
// router.get("/commands/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   console.log(product);
//   const command = await Command.find({ _id: { $in: product.commands } })
//     .populate("product", "name -_id")
//     .select("-__v")
//     .sort("note");
//   res.send(command);
// });

// -------------------------------------------

router.put("/:id" /* , auth */, async (req, res) => {
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

module.exports = router;
