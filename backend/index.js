const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const militaires = require("./routes/militaires");
const fonctions = require("./routes/fonctions");
const permissions = require("./routes/permissions");
const infosPersonnel = require("./routes/infosPersonnel");
const stages = require("./routes/stages");
const stagesEffectues = require("./routes/stagesEffectues");
const stations = require("./routes/stations");
const releves = require("./routes/releves");
const indisposRadar = require("./routes/indisponibilitesRadar");
const nombreDetections = require("./routes/nombreDetections");
const categoriesRadio = require("./routes/categoriesRadio");
const accessoires = require("./routes/accessoires");
const materiels = require("./routes/materiels");
const suiviMateriels = require("./routes/suiviMateriels");
const app = express();
const cors = require("cors");

app.use(cors());
mongoose
  .connect("mongodb://localhost/CentreTrans", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/ct/militaires", militaires);
app.use("/ct/fonctions", fonctions);
app.use("/ct/permissions", permissions);
app.use("/ct/infosPersonnel", infosPersonnel);
app.use("/ct/stages", stages);
app.use("/ct/stagesEffectues", stagesEffectues);
app.use("/ct/stations", stations);
app.use("/ct/releves", releves);
app.use("/ct/indisponibilitesRadar", indisposRadar);
app.use("/ct/nombreDetections", nombreDetections);
app.use("/ct/categoriesRadio", categoriesRadio);
app.use("/ct/accessoires", accessoires);
app.use("/ct/materiels", materiels);
app.use("/ct/suiviMateriels", suiviMateriels);
const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on port ${port}...`));
