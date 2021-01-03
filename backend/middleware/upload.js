const multer = require("multer");
const util = require("util");
const path = require("path");
const maxsize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/products");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxsize },
}).single("image");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
