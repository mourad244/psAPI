const express = require("express");
const categoriesSvc = require("../routes/categoriesSvc");
const accessoires = require("../routes/accessoires");
const services = require("../routes/services");
const productsCategorie = require("../routes/productsCategorie");
const productsType = require("../routes/productsType");
const clients = require("../routes/clients");
const products = require("../routes/products");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const cors = require("cors");
var bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/psapi/products", products);
  app.use("/psapi/productstype", productsType);
  app.use("/psapi/productscategorie", productsCategorie);
  app.use("/psapi/categoriesvc", categoriesSvc);
  app.use("/psapi/accessoires", accessoires);
  app.use("/psapi/services", services);
  app.use("/psapi/clients", clients);
  app.use("/psapi/users", users);
  app.use("/psapi/auth", auth);
  app.use(error);
};
//add