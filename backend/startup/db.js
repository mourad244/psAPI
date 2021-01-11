const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect({
      username: process.env.DB_ADMIN_USERNAME, //techbos
      password: process.env.DB_ADMIN_PASSWORD, // Pa$$w0rd
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
