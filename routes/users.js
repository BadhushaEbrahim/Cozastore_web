const express = require("express");
const router = express.Router();
const veryfy = require("../middleware/veryfyuser");

const {
  userhomePage,
  getLogin,
  getSignup,
  postSignup,
  ChangeProductQuantity,
  postLogin,
  getLogout,
  getProducts,
  getProductDetails,
  getotpPage,
  getcartDetails,
  addToCart,
  getCheckoutPage,
  PlaceOrder,
  sucessOrder,
  postOtp,
  getconfirmOTP,
  postconfirmOTP,
  getOrders,
  getUserProfile,
  userCancelOrder,
  removeProductFromCart,
  viewOrderedProducts,
  getCategoryWise,
  paymentVerify,
  postUserProfile,
  userCancelProduct,
  addUserAddress,
  setOrderedProductStatus,
  addDeliveryAaddress,
  editAddress,
  postEditUserAddress,
  deleteUserAddress,
  postCouponApply,
  postCouponRemove,
  displayWishList,
  addToWishList,
  removeProductFromWishlist,
  getPaymentFailed,
  postSearchProducts,
  returnProduct,
} = require("../controllers/user-controler");
const { verify } = require("jsonwebtoken");

//user routing starts here//
router.get("/", userhomePage);
router.get("/userLogin", getLogin);
router.post("/", postLogin);
router.get("/userLogout", getLogout);
router.get("/userSignup", getSignup);
router.post("/userSignup", postSignup);
router.get("/products", getProducts);
router.get("/getProductDetail/", getProductDetails);
router.get("/viewCategoryWise/", getCategoryWise);
router.get("/OtpPage", getotpPage);
router.post("/otp", postOtp);
router.get("/confirmOtp", getconfirmOTP);
router.post("/confirmotp", postconfirmOTP);
router.get("/cart", getcartDetails);
router.get("/addToCart/:id", addToCart);
router.post("/removeFromCart", removeProductFromCart);
router.get("/addToWishList/:id", addToWishList);
router.get("/wishList", displayWishList);
router.post("/removeFromWishList", removeProductFromWishlist);
router.post("/changeProductQuantity", ChangeProductQuantity);
router.get("/proceedToCheckOut", veryfy.veryfylogin, getCheckoutPage);
router.post("/placeOrder", PlaceOrder);
router.get("/orderSucess", veryfy.veryfylogin, sucessOrder);
router.get("/ViewOrders", veryfy.veryfylogin, getOrders);
router.get("/userProfile", getUserProfile);
router.post("/addUserAddress", addUserAddress);
router.get("/editAddress/:id", veryfy.veryfylogin, editAddress);
router.post("/editUseraddress", postEditUserAddress);
router.get("/deleteUserAddress/:id", deleteUserAddress);
router.post("/editUserProfile", postUserProfile);
router.post("/addShippingAddress1", addDeliveryAaddress);
router.get("/viewOrderProducts/:id", viewOrderedProducts);
router.get("/userCancelOrder", userCancelOrder);
router.get("/userCancelProductOrder", userCancelProduct);
router.post("/userOrderedProductsStatus", setOrderedProductStatus);
router.post("/verifyPayment", paymentVerify);
router.post("/returnProduct", returnProduct);
router.post("/applyCoupon", postCouponApply);
router.post("/removeCoupon", postCouponRemove);
router.post("/searchProducts", postSearchProducts);
router.get("/payment-failed/:orderId", getPaymentFailed);

module.exports = router;
