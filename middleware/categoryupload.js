const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/category-images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "- " + Date.now() + path.extname(file.originalname)
    );
  },
});

var uploadcategory = multer({
  storage: storage,
});

module.exports = {
  uploadcategory: uploadcategory,
};
