const { Client, validate } = require("../models/client");
// const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/" /* , auth */, async (req, res) => {
  const clients = await Client.find().select("-__v").sort("name");
  res.send(clients);
});

router.post("/" /* , auth */, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let client = new Client({
    name: req.body.name,
    email: req.body.email,
  });
  client = await client.save();

  res.send(client);
});

// router.put("/:id" /* , auth */, async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const client = await Client.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true }
//   );

//   if (!client)
//     return res.status(404).send("The client with the given ID was not found.");

//   res.send(client);
// });

router.delete("/:id" /* , auth */, async (req, res) => {
  const client = await Client.findByIdAndRemove(req.params.id);

  if (!client)
    return res.status(404).send("The client with the given ID was not found.");

  res.send(client);
});

router.get("/:id" /* , auth */, async (req, res) => {
  const client = await Client.findById(req.params.id).select("-__v");

  if (!client)
    return res.status(404).send("The client with the given ID was not found.");

  res.send(client);
});

module.exports = router;
