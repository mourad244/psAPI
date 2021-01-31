const util = require("util");
const path = require("path");
const multer = require("multer");
const { array } = require("joi");
const maxsize = 2 * 1024 * 1024;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e2) +
        path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImages = multer({
  storage: storage,
  limits: maxsize,
  fileFilter: fileFilter,
}).array("images", 10);

const uploadImagesMiddleware = util.promisify(uploadImages);
module.exports = uploadImagesMiddleware;
