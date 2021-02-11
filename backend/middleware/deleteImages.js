const fs = require("fs");

module.exports = deleteImages = (files) => {
  console.log(files);
  files.map((image) => {
    fs.unlinkSync(image.path);
  });
};
