var productHelper = require('../helpers/product-helpers')
var adminHelper = require('../helpers/admin-helpers')
var userHelper = require('../helpers/user-helpers');
const { CallPage } = require('twilio/lib/rest/insights/v1/call');
const { ChallengeList } = require('twilio/lib/rest/verify/v2/service/entity/challenge');
const collections = require('../config/collections');
const { ObjectId } = require('mongodb');




module.exports = {



    //---------------------------ADMIN LIST ALL PRODUCTS------------------------------//


    adminViewProducts: (req, res) => {
        let admin = req.session.admin;
        if (admin) {
            productHelper.getAllProducts().then((products) => {
                console.log(products)
                res.render('admin/admin-viewProducts', { layout: 'admin-layout', products })
            })
        }
        else {

        }
    },

    //---------------------------ADMIN ADD PRODUCTS------------------------------//

    adminAddProduct: (req, res) => {
        let admin = req.session.admin
        if (admin) {
            adminHelper.getAllCategories().then((categories) => {
                res.render('admin/admin-addProduct', { layout: 'admin-layout', categories })
            })
        } else {
            res.redirect('/admin')
        }


    },


    adminAddProductIn: (req, res) => {
       console.log("this is product body",req.body);
       req.body.image=req.files.image[0].filename
       req.body.image1=req.files.image1[0].filename
       req.body.image2=req.files.image2[0].filename
       req.body.image3=req.files.image3[0].filename

        productHelper.addProduct(req.body).then((response) => {
            res.redirect('/products/admin-addProduct')
        })


    },

    //---------------------------ADMIN DELETE PRODUCTS------------------------------//

    adminDeleteProduct: (req, res) => {
        let productId = req.params.id;
        productHelper.deleteProducts(productId).then((response) => {
            res.redirect('/products/admin-viewProducts');
        })
    },



    //---------------------------ADMIN EDIT PRODUCTS------------------------------//

    adminEditProduct: async (req, res) => {
        let admin = req.session.admin
        let proId=req.query.id
        if (admin) {
            let product = await productHelper.getProductDetails(proId)
            console.log("this is product details---------------",product);
            res.render('admin/admin-editProducts', { layout: 'admin-layout', product });
        } else {
            res.render('/admin')
        }



    },

    adminEditProductIn: async (req, res) => {
      let editid=req.query.id
      if (req.files.image == null) {
        Image1 = await productHelper.fetchImage1(editid)
    } else {
        Image1 = req.files.image[0].filename
    }
    if (req.files.image1 == null) {
        Image2 = await productHelper.fetchImage2(editid)
    } else {
        Image2 = req.files.image1[0].filename
    }
    if (req.files.image2 == null) {
        Image3 = await productHelper.fetchImage3(editid)
    } else {
        Image3 = req.files.image2[0].filename
    }
    if (req.files.image3 == null) {
        Image4 = await productHelper.fetchImage4(editid)
    } else {
        Image4 = req.files.image3[0].filename
    }
    req.body.image = Image1
    req.body.image1 = Image2
    req.body.image2 = Image3
    req.body.image3 = Image4
  console.log("this is edit id*************************",editid);
        productHelper.updateProduct(editid,req.body).then(() => {
            res.redirect('/products/admin-viewProducts');
        });
    }
    


}



