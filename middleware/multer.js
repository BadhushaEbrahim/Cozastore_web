const multer = require('multer')
const path = require('path')
// const sharp=require('sharp')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/product-images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '- ' + Date.now() + path.extname(file.originalname))
  }
})

const uploadMultiple = multer({ storage:storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 },{name:'image4',maxCount:1}])



module.exports = {
  uploadproductimage: uploadMultiple
}