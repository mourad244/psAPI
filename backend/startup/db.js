const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
require("dotenv").config();

module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://" +
        process.env.DB_USERNAME +
        ":" +
        process.env.DB_PASSWORD +
        "@cluster0.x0xqe.mongodb.net/psapi?retryWrites=true&w=majority" /*||  config.get("db") */,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    )
    .then(() => logger.info("Connected to MongoDB..."));
};
