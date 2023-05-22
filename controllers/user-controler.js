const UserDetailsHelper = require("../helpers/user-helpers");
const productHelpers = require("../helpers/product-helpers");
const userHelper = require("../helpers/user-helpers");

module.exports = {
  //---------------------------HOME PAGE DISPLAY------------------------------//

  userhomePage: async (req, res) => {
    const user = req.session.user;
    req.session.returnTo = req.originalUrl;
    let cartCount = null;
    let wishlistCount = null;
    if (req.session.user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }

    const categories = await userHelper.getAllcategories();
    userHelper
      .getAllBanners()
      .then((banners) => {
        UserDetailsHelper.getAllProducts()
          .then((products) => {
            res.render("user/index", {
              user,
              products,
              cartCount,
              categories,
              banners,
              wishlistCount,
            });
          })
          .catch((err) => {
            res.render("404", { layout: null });
          });
      })
      .catch((err) => {
        res.render("404", { layout: null });
      });
  },

  //---------------------------USER LOGIN------------------------------//

  getLogin: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("user/userLogin", {
        layout: null,
        loginErr: req.session.loginErr,
      });
      req.session.loginErr = false;
    }
  },

  postLogin: (req, res) => {
    userHelper.usersLogin(req.body).then((response) => {
      if (response.status) {
        if (response.user.isblocked) {
          res.redirect("/userlogin");
        } else {
          req.session.loggedIn = true;
          req.session.user = response.user;
          res.redirect(req.session.returnTo);
        }
      } else {
        req.session.loginErr = "Invalid UserName or Password";
        res.redirect("/userLogin");
      }
    });
  },

  //---------------------------USER LOGOUT------------------------------//

  getLogout: (req, res) => {
    req.session.user = false;
    req.session.loggedIn = false;
    res.redirect("/");
  },

  //---------------------------USER SIGNUP DETAILS------------------------------//

  getSignup: (req, res) => {
    res.render("user/userSignUp", { layout: null });
  },

  postSignup: (req, res) => {
    userHelper.usersSignup(req.body).then((response) => {
      if (response.status == false) {
        req.session.UserSignUpError = "USER ALREADY EXISTS";
        res.render("user/userSignUp", {
          layout: null,
          UserSignUpError: req.session.UserSignUpError,
        });
        req.session.UserSignUpError = false;
      } else {
        res.redirect("/userLogin");
      }
    });
  },

  //---------------------------USERLIST ALL PRODUCTS------------------------------//

  getProducts: async (req, res) => {
    let cartCount = null;
    let wishlistCount = null;
    if (req.session.user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    const categories = await userHelper.getAllcategories();
    UserDetailsHelper.getAllProducts().then((products) => {
      const user = req.session.user;
      req.session.returnTo = req.originalUrl;
      res.render("user/product", {
        products,
        user,
        cartCount,
        wishlistCount,
        categories,
      });
    });
  },

  //--------------------------SHOW CATEGORY WISE PRODUCTS---------------------------------//

  getCategoryWise: async (req, res) => {
    let cartCount = null;
    let wishlistCount = null;
    if (req.session.user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    const user = req.session.user;
    req.session.returnTo = req.originalUrl;
    const categories = await userHelper.getAllcategories();
    const products = await productHelpers.getCategoryWiseProducts(req.query.id);
    res.render("user/product-categoryView", {
      user,
      products,
      cartCount,
      wishlistCount,
      categories,
    });
  },

  //-------------------------SINGLE PRODUCT VIEW DETAILS----------------------------------//

  getProductDetails: async (req, res) => {
    let cartCount = 0;
    let wishlistCount = 0;
    const user = req.session.user;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }

    req.session.returnTo = req.originalUrl;
    const categories = await userHelper.getAllcategories();
    const product = await productHelpers.getProductDetails(req.query.id);
    res.render("user/product-view", {
      user,
      product,
      cartCount,
      wishlistCount,
      categories,
    });
  },

  //----------------------------------OTP LOGIN-------------------------------------------//
  getotpPage: (req, res) => {
    res.render("user/userOtp", { layout: null });
  },

  const: (signupData = 0),

  //----------------------------------POST OTP---------------------------------------------------//

  postOtp: (req, res) => {
    userHelper.doOTP(req.body).then((response) => {
      if (response.status) {
        signupData = response.user;

        res.redirect("/confirmOtp");
      } else {
        res.redirect("/OtpPage");
      }
    });
  },

  //----------------------------------DISPLAY CONFIRM OTP PAGE----------------------------------------

  getconfirmOTP: (req, res) => {
    res.render("user/userConfirmOtp", { layout: null });
  },

  //-----------------------------------POST CONFIRM OTP----------------------------------------------

  postconfirmOTP: (req, res) => {
    userHelper.doOTPConfirm(req.body, signupData).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = signupData;

        res.redirect("/");
      } else {
        res.redirect("/confirmOtp");
      }
    });
  },

  //--------------------------------------GET CART DETAILS------------------------------------//

  getcartDetails: async (req, res) => {
    const user = req.session.user._id;

    if (user) {
      const name = req.session.user;
      const products = await userHelper.getCartProducts(req.session.user._id);
      let totalValue = 0;
      if (products.length > 0) {
        totalValue = await userHelper.getTotalAmount(req.session.user._id);
      }
      const categories = await userHelper.getAllcategories();
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      res.render("user/cart", {
        user,
        products,
        totalValue,
        cartCount,
        name,
        wishlistCount,
        categories,
      });
    } else {
      res.redirect("/");
    }
  },

  //-----------------------------------------VERIFY LOGIN MIDDLEWARE-----------------------------------------//

  verifyUserLogin: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/userLogin");
    }
  },

  //-----------------------------------------ADD TO CART-----------------------------------------//

  addToCart: (req, res) => {
    userHelper
      .productAddToCart(req.params.id, req.session.user._id)
      .then(() => {
        res.json({ status: true });
      });
  },

  //-----------------------------------------PRODUCT REMOVE FROM CART------------------//

  removeProductFromCart: async (req, res) => {
    userHelper.removeCartProduct(req.body).then(async (response) => {
      res.json({ status: true });
    });
  },

  addToWishList: (req, res) => {
    userHelper
      .addProductToWishList(req.params.id, req.session.user._id)
      .then(() => {
        res.json({ status: true });
      });
  },

  //-----------------------------------------REMOVE FROM WIHSLIST------------------------

  removeProductFromWishlist: async (req, res) => {
    userHelper.removeWishlistProduct(req.body).then(async (response) => {
      res.json({ status: true });
    });
  },

  ChangeProductQuantity: (req, res, next) => {
    userHelper.changeProductsQuantity(req.body).then(async (response) => {
      response.total = await userHelper.getTotalAmount(req.body.user);
      res.json(response);
    });
  },

  removeProductFrmCart: (req, res) => {
    const productId = req.params.id;
    userHelper.deleteCartProduct(productId).then((response) => {
      res.redirect("/cart");
    });
  },

  //---------------------------------------PROCEED TO CHECKOUT PGE----------------------------------//

  getCheckoutPage: async (req, res) => {
    const user = req.session.user;
    if (user) {
      const address = await userHelper.getShippingAddress(req.session.user._id);
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      const categories = await userHelper.getAllcategories();
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const total = await userHelper.getTotalAmount(req.session.user._id);

      res.render("user/checkOut", {
        user,
        cartCount,
        total,
        address,
        wishlistCount,
        categories,
      });
    } else {
      res.redirect("/");
    }
  },

  //--------------------------------------PLACE ORDER---------------------------------------------

  PlaceOrder: async (req, res) => {
    let user = req.session.user;
    const products = await userHelper.getCartProductList(req.body.userId);
    let totalPrice = await userHelper.getTotalAmount(req.body.userId);
    const productPrice = await userHelper.getProductPrice(req.body.userId);
    const verifyCoupon = await userHelper.couponVerify(user._id);

    if (verifyCoupon.couponId == req.body.couponcode) {
      const discountAmount = Math.floor(
        (totalPrice * parseInt(verifyCoupon.couponPercentage)) / 100
      );

      const amount = totalPrice - discountAmount;

      await userHelper
        .placeOrder(req.body, products, amount, user._id)
        .then((orderId) => {
          if (req.body["paymentMethod"] === "COD") {
            res.json({ codSuccess: true });
          } else if (req.body["paymentMethod"] === "RAZORPAY") {
            userHelper.generateRazorPay(orderId, amount).then((response) => {
              response.razorPay = true;
              res.json(response);
            });
          }
        });
    } else {
      userHelper
        .placeOrder(req.body, products, totalPrice, user)
        .then((orderId) => {
          if (req.body["paymentMethod"] === "COD") {
            res.json({ codSuccess: true });
          } else if (req.body["paymentMethod"] === "RAZORPAY") {
            userHelper
              .generateRazorPay(orderId, totalPrice)
              .then((response) => {
                response.razorPay = true;
                res.json(response);
              });
          }
        });
    }
  },

  //---------------------------------------PAYMENT - FAILED RAZORPAY--------------------

  getPaymentFailed: async (req, res) => {
    // if(req.session.user.orderId){
    const user = req.session.user;
    await userHelper.deletePendingOrder(req.params.orderId).then(async () => {
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const categories = await userHelper.getAllcategories();
      res.render("user/paymentFailed", {
        cartCount,
        wishlistCount,
        user,
        categories,
      });
    });
  },

  //-----------------------------------------ORDER SUCESSS RENDER PAGE-------------------------

  sucessOrder: async (req, res) => {
    const user = req.session.user;
    const categories = await userHelper.getAllcategories();
    res.render("user/orderSucess", { user, categories });
  },

  //----------------------------------------VIEW ORDERS PAGE------------------------------------

  getOrders: async (req, res) => {
    const user = req.session.user;
    if (user) {
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const orders = await userHelper.getUserOrders(req.session.user._id);
      const categories = await userHelper.getAllcategories();
      res.render("user/userOrders", {
        orders,
        user: req.session.user,
        cartCount,
        wishlistCount,
        categories,
      });
    } else {
      res.redirect("/");
    }
  },

  //-------------------------------------------SHOW USER PROFILE--------------------------

  getUserProfile: async (req, res) => {
    const user = req.session.user;
    if (user) {
      const allAddress = await userHelper.getShippingAddress(
        req.session.user._id
      );
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const categories = await userHelper.getAllcategories();

      userHelper.getUserDetails(req.session.user._id).then((user) => {
        res.render("user/userProfile", {
          user,
          allAddress,
          cartCount,
          wishlistCount,
          categories,
        });
      });
    } else {
      res.redirect("/");
    }
  },

  //--------------------------------------EDIT USER PROFILE-------------------------------------

  postUserProfile: (req, res) => {
    const user = req.session.user._id;
    userHelper.updateUserProfile(user, req.body).then((response) => {
      res.json({ status: true });
    });
  },

  //----------------------------------ADD USER ADDRESS-------------------------------------------

  addUserAddress: (req, res) => {
    const userId = req.session.user._id;
    userHelper.addAddress(userId, req.body).then((data) => {
      res.redirect("/userProfile");
    });
  },

  //----------------------EDIT USER ADDRESS----------------------------------------------------

  editAddress: async (req, res) => {
    const user = req.session.user;
    if (user) {
      const userId = req.session.user._id;
      const Id = req.params.id;
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const categories = await userHelper.getAllcategories();
      userHelper.editUserAddress(Id, userId).then((data) => {
        res.render("user/editUserAddress", {
          data,
          user,
          cartCount,
          wishlistCount,
          categories,
        });
      });
    } else {
      res.redirect("/");
    }
  },

  //------------------------POST EDIT USER ADDRESS-------------------------------------------------

  postEditUserAddress: (req, res) => {
    const userId = req.body.user;
    const Id = req.body.id;

    userHelper.postEditUserAddress(req.body, userId, Id).then((response) => {
      res.redirect("/userProfile");
    });
  },

  //-------------------------------DELETE USER ADDRESS-----------------------------------

  deleteUserAddress: (req, res) => {
    const id = req.params.id;
    const userId = req.session.user._id;
    userHelper.deleteAddress(userId, id).then((response) => {
      res.redirect("/userProfile");
    });
  },

  //---------------------------------------------------USER CANCEL ORDER---------------------------------

  userCancelOrder: (req, res) => {
    const cancelUserId = req.query.id;
    userHelper.updateUserOrderStatus(cancelUserId);
    res.redirect("/ViewOrders");
  },

  //-------------------------------------------SHOW ORDERED PRODUCTS-----------------------------------------

  viewOrderedProducts: async (req, res) => {
    const products = await userHelper.getOrderdProducts(req.params.id);
    let cartCount = await userHelper.getCartCount(req.session.user._id);
    let wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    const categories = await userHelper.getAllcategories();
    res.render("user/orderedProducts", {
      products,
      user: req.session.user,
      cartCount,
      wishlistCount,
      categories,
    });
  },

  //------------------------------------------CANCEL ORDER--------------------------------------

  userCancelProduct: (req, res) => {
    const cancelProductId = req.query.id;
    userHelper.updateProductOrderStatus(cancelProductId); //NEEDED TO RECTIFY
    res.redirect("/viewOrderProducts/:id");
  },

  //---------------------------------------------CANCEL ORDERED PRODUCT-------------------------------

  setOrderedProductStatus: (req, res) => {
    const status = req.body.status;
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    userHelper
      .setEachProductStatus(status, orderId, productId)
      .then((response) => {
        if (response) {
          res.json({ status: true });
        } else {
          res.json({ status: false });
        }
      });
  },

  //-----------------------------------------VERIFY PAYMENT------------------------------

  paymentVerify: (req, res) => {
    userHelper
      .verifyPayment(req.body)
      .then(() => {
        userHelper.changePaymentStatus(req.body["order[receipt]"]).then(() => {
          res.json({ status: true });
        });
      })
      .catch((err) => {
        res.json({ status: false });
      });
  },

  addDeliveryAaddress: (req, res) => {
    userHelper.addAddress(req.session.user._id, req.body).then((data) => {
      res.redirect("/proceedToCheckOut");
    });
  },

  //---------------------------POST APPLY COUPON----------------------------------

  postCouponApply: async (req, res) => {
    const user = req.session.user._id;
    const date = new Date();
    const totalAmount = await userHelper.getTotalAmount(user);
    const Total = totalAmount;

    if (req.body.coupon == "") {
      res.json({ noCoupon: true, Total });
    } else {
      const couponres = await userHelper.applyCoupon(
        req.body,
        user,
        date,
        totalAmount
      );
      if (couponres.verify) {
        const discountAmount =
          (totalAmount * parseInt(couponres.couponData.couponPercentage)) / 100;
        const amount = totalAmount - discountAmount;
        couponres.discountAmount = Math.round(discountAmount);
        couponres.amount = Math.round(amount);
        res.json(couponres);
      } else {
        couponres.Total = totalAmount;
        res.json(couponres);
      }
    }
  },

  //------------------------------------POST REMOVE COUPON--------------------------------------

  postCouponRemove: async (req, res) => {
    const user = req.session.user._id;
    await userHelper.removeCoupon(user).then(async (response) => {
      response.totalAmount = await userHelper.getTotalAmount(user);
      res.json(response);
    });
  },

  //----------------------------------SHOW WISH LIST---------------------------------------------

  displayWishList: async (req, res) => {
    const user = req.session.user;
    if (user) {
      const products = await userHelper.getWishListProducts(
        req.session.user._id
      );
      let totalValue = 0;
      if (products.length > 0) {
        totalValue = await userHelper.getTotalAmount(req.session.user._id);
      }
      let cartCount = await userHelper.getCartCount(req.session.user._id);
      let wishlistCount = await userHelper.getWishlistCount(
        req.session.user._id
      );
      const categories = await userHelper.getAllcategories();
      res.render("user/wishList", {
        user,
        products,
        totalValue,
        cartCount,
        wishlistCount,
        categories,
      });
    } else {
      res.redirect("/");
    }
  },

  //---------------------------------SEARCH PRODUCTS--------------------------------------------------

  postSearchProducts: async (req, res) => {
    let cartCount = null;
    let wishlistCount = null;
    const user = req.session.user;

    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
      const categories = await userHelper.getAllcategories();
      userHelper
        .searchProducts(req.body.search)
        .then((products) => {
          res.render("user/searchedProducts", {
            products,
            cartCount,
            wishlistCount,
            user,
            categories,
          });
        })
        .catch((err) => {
          if (err.productNotFound) {
            res.render("user/searchedProducts", {
              cartCount,
              wishlistCount,
              user,
              categories,
              err,
            });
          }
        });
    } else {
      const categories = await userHelper.getAllcategories();
      userHelper
        .searchProducts(req.body.search)
        .then((products) => {
          res.render("user/searchedProducts", { products, categories });
        })
        .catch((err) => {
          if (err.productNotFound) {
            res.render("user/searchedProducts", { categories, err });
          }
        });
    }
  },

  //--------------------------------------RETURN ORDERED PRODUCTS---------------------------------

  returnProduct: async (req, res) => {
    const user = req.session.user;
    const description = "Order Returned";
    await userHelper.setWalletHistory(user, req.body, description);
    await userHelper.returnOrderedProduct(req.body, user).then((response) => {
      res.json(response);
    });
  },
};
