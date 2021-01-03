const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const categoriesSvc = require("./routes/categoriesSvc");
const accessoires = require("./routes/accessoires");
const services = require("./routes/services");
const productsCategorie = require("./routes/productsCategorie");
const productsType = require("./routes/productsType");
const clients = require("./routes/clients");
const products = require("./routes/products");
const app = express();
const cors = require("cors");

var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost/psapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/psapi/products", products);
app.use("/psapi/productstype", productsType);
app.use("/psapi/productscategorie", productsCategorie);
app.use("/psapi/categoriesvc", categoriesSvc);
app.use("/psapi/accessoires", accessoires);
app.use("/psapi/services", services);
app.use("/psapi/clients", clients);

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on port ${port}...`));
