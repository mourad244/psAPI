const winston = require("winston");
const express = require("express");
const logger = require("./startup/logging");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3900;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
