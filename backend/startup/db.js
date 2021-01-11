const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
