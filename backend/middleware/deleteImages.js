const fs = require("fs");

module.exports = deleteImages = (file) => {
  file.length > 1
    ? file.forEach((image) => fs.unlinkSync(image.path))
    : fs.unlinkSync(file.path);
};
