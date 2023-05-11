const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/banner-images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '- ' + Date.now() + path.extname(file.originalname))
  }
})


const uploadBanner = multer({ storage:storage }).fields([{ name: 'banimg', maxCount: 1 }])



module.exports = {
  uploadBanner: uploadBanner
}