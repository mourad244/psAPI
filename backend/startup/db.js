const logger = require("../startup/logging");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
