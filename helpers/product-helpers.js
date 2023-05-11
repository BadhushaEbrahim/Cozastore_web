var db = require('../config/connection');
var collection = require('../config/collections');
var ObjectId = require('mongodb').ObjectId

module.exports = {

  /* -------------------------------------------------------------------------- */
  /*                           ADD PRODUCTS                                     */
  /* -------------------------------------------------------------------------- */

  addProduct: (product) => {
    try {
      return new Promise((resolve, reject) => {
        console.log("wwwww", product, "sdasdasdasd");

        let data = db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product)
        resolve(data)
      })
    } catch (error) {
      reject(error)
    }

  },

  /* -------------------------------------------------------------------------- */
  /*                                LIST ALL PRDUCTS                            */
  /* -------------------------------------------------------------------------- */

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                                 DELETE PRODUCTS                            */
  /* -------------------------------------------------------------------------- */

  deleteProducts: (productId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(productId) }).then((response) => {

        resolve(response)
      })
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                                GET PRODUCT DETAILS                         */
  /* -------------------------------------------------------------------------- */


  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }).then((product) => {
        resolve(product)
      })
    })
  },




  /* -------------------------------------------------------------------------- */
  /*                         GET CATEGORY WISE PRODUCT DETAILS                  */
  /* -------------------------------------------------------------------------- */



  getCategoryWiseProducts: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      let categoryDetails = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: ObjectId(categoryId) })
      // console.log(categoryDetails)
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ category: categoryDetails.category }).toArray()
      // console.log(products,"heyy")
      resolve(products)
    })
  },
  
  /* -------------------------------------------------------------------------- */
  /*                                UPDATE PRODUCTS                             */
  /* -------------------------------------------------------------------------- */

  updateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(productId) }, {
        $set: {
          name: productDetails.name,
          description: productDetails.description,
          price: productDetails.price,
          category: productDetails.category,
          image: productDetails.image,
          image1: productDetails.image1,
          image2: productDetails.image2,
          image3: productDetails.image3

        }
      }).then((response) => {
        resolve()
      })
    })
  },
  fetchImage1: (productId) => {
    console.log(productId,'hi img 1');
    return new Promise(async (resolve, reject) => {
        let detail = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id:ObjectId(productId) }, { projection: { image: true } })
        resolve(detail.image)
    })
},
fetchImage2: (productId) => {
    return new Promise(async (resolve, reject) => {
        let detail = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }, { projection: { image1: true } })
        resolve(detail.image1)
    })
},
fetchImage3: (productId) => {
    return new Promise(async (resolve, reject) => {
        let detail = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }, { projection: { image2: true } })
        resolve(detail.image2)
    })
},
fetchImage4: (productId) => {
    return new Promise(async (resolve, reject) => {
        let detail = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }, { projection: { image3: true } })
        resolve(detail.image3)
    })
}

}