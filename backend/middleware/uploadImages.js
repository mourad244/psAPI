const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} n'est pas valide. seuls les formats png/jpeg/jpg acceptés.`;
      return callback(message, null);
    }

    var filename = Date.now() + path.extname(file.originalname);
    callback(null, filename);
  },
});

var uploadFiles = multer({ storage: storage }).array("image", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
