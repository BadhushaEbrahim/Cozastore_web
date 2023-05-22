const { response } = require("express");
const adminHelper = require("../helpers/admin-helpers");

const user = require("./user-controler");
const { Admin } = require("mongodb");

const adminId = "admin@gmail.com";
const passwordId = "12345";

module.exports = {
  //------------------------------------- ADMIN SIGNUP ------------------------------------//

  adminSignup: async (req, res) => {
    const admin = req.session.admin;
    if (admin) {
      res.redirect("/admin/adminLogin");
    } else {
      res.render("admin/adminLogin", {
        layout: null,
        adminLoginError: req.session.adminLoginError,
      });

      req.session.adminLoginError = false;
    }
  },

  //------------------------------------ ADMIN LOGIN ------------------------------------//

  adminLogin: async (req, res) => {
    const adminId = req.session.admin;
    if (adminId) {
      const TotalUsers = await adminHelper.getTotalUsers();
      const salesData = await adminHelper.getAllSales();
      const totalProducts = await adminHelper.getAllProductCount();
      const totalOrders = await adminHelper.getTotalOrders();
      const daily = await adminHelper.getDailySalesGraph();
      const monthly = await adminHelper.getMonthlySalesGraph();
      const yearly = await adminHelper.getYearlySalesGraph();
      const paymentmode = await adminHelper.getPaymentWiseDetails();
      const profit = await adminHelper.getPofitdetails();
      res.render("admin/admin-dashboard", {
        layout: "admin-layout",
        TotalUsers,
        salesData,
        totalProducts,
        totalOrders,
        daily,
        monthly,
        yearly,
        paymentmode,
        profit,
      });
    } else {
      res.redirect("/admin");
    }
  },

  adminLoggedIn: (req, res) => {
    const adminData = ({ email, password } = req.body);
    if (adminId === email && passwordId === password) {
      req.session.adminLoggedIn = true;
      req.session.admin = adminData;
      res.redirect("/admin/adminLogin");
    } else {
      req.session.adminLoginError = "Invalid adminId and Password";
      res.redirect("/admin");
    }
  },

  logout: (req, res) => {
    req.session.admin = null;
    req.session.adminLoggedIn = false;
    res.redirect("/admin");
  },

  //----------------------------- ADMIN GET USER LIST MANAGEMENT--------------------------------//

  userList: (req, res) => {
    const admin = req.session.admin;
    if (admin) {
      adminHelper.getAllUsers().then((users) => {
        res.render("admin/admin-viewUser", { layout: "admin-layout", users });
      });
    } else {
      res.redirect("/admin");
    }
  },

  //---------------------------- ADMIN BLOCK USER ---------------------------------------------//

  blockUser: (req, res) => {
    const blockUserId = req.query.id;
    adminHelper.updateUserStatus(blockUserId);
    res.redirect("/admin/userList");
  },

  //---------------------------- ADMIN UNBLOCK USER ---------------------------------------------//

  UnBlockUser: (req, res) => {
    const unBlockUserId = req.query.id;
    adminHelper.setUserStatus(unBlockUserId);
    res.redirect("/admin/userList");
  },

  //---------------------------- ADMIN DISPLAY CATEGORY LIST---------------------------------------------//

  getCategory: (req, res) => {
    const admin = req.session.admin;
    if (admin) {
      adminHelper.getAllCategories().then((categories) => {
        res.render("admin/admin-ViewCategory", {
          layout: "admin-layout",
          categories,
        });
      });
    } else {
      res.redirect("/admin");
    }
  },

  //---------------------------- ADMIN ADD CATEGORIES PAGE---------------------------------------------//

  addCategory: (req, res) => {
    const admin = req.session.admin;
    if (admin) {
      res.render("admin/admin-addCategories", { layout: "admin-layout" });
    } else {
      res.redirect("/admin");
    }
  },

  //---------------------------- ADMIN ADD CATEGORIES INN---------------------------------------------//

  addCategoryIn: (req, res) => {
    req.body.image = req.files[0].filename;
    adminHelper.addCategory(req.body).then(() => {
      res.redirect("/admin/addCategories");
    });
  },

  //---------------------------- ADMIN UPDATE CATEGORIES INN---------------------------------------------//

  editCategory: async (req, res) => {
    const admin = req.session.admin;
    if (admin) {
      const categoryList = await adminHelper.getCategory(req.query.id);
      res.render("admin/admin-editCategory", {
        layout: "admin-layout",
        categoryList,
      });
    } else {
      res.redirect("/admin");
    }
  },

  editCategoryIn: (req, res) => {
    adminHelper.editCategory(req.params.id, req.body).then(() => {
      const id = req.params.id;
      res.redirect("/admin/getCategory");
    });
  },

  /*-------------------------------------------------------------------*/
  /*                            DELETE CATEGORY                        */
  /*-------------------------------------------------------------------*/

  deleteCategory: (req, res) => {
    const categoryId = req.params.id;
    adminHelper.deleteCategories(categoryId).then((response) => {
      res.redirect("/admin/getCategory");
    });
  },

  /*-------------------------------------------------------------------*/
  /*                          VIEW ALL ORDERS                          */
  /*-------------------------------------------------------------------*/

  ViewAllUserOrders: (req, res) => {
    adminHelper.getAlluserOrders().then((ordersList) => {
      res.render("admin/ViewOrdersList", {
        layout: "admin-layout",
        ordersList,
      });
    });
  },

  /*-------------------------------------------------------------------*/
  /*                     VIEW PRODUCTS ORDERS                          */
  /*-------------------------------------------------------------------*/

  adminProductWiseOrders: async (req, res) => {
    const products = await adminHelper.getProductWiseOrders(req.params.id);
    res.render("admin/VieworderedProducts", {
      layout: "admin-layout",
      products,
    });
  },

  /*-------------------------------------------------------------------*/
  /*                     SET ORDERD PRODUCT STATUS                     */
  /*-------------------------------------------------------------------*/

  setPorductOrderStatus: (req, res, next) => {
    const status = req.body.status;
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    adminHelper
      .setDeliveryStatus(status, orderId, productId)
      .then((response) => {
        if (response) {
          res.json({ status: true });
        } else {
          res.json({ status: false });
        }
      });
  },

  /*-------------------------------------------------------------------*/
  /*                     ADMIN SHOW BANNERS                             */
  /*-------------------------------------------------------------------*/

  viewAdminBanners: async (req, res) => {
    const banners = await adminHelper.showBanners();
    res.render("admin/showBanners", { layout: "admin-layout", banners });
  },

  /*-------------------------------------------------------------------*/
  /*                     ADMIN ADD BANNERS FORM                       */
  /*-------------------------------------------------------------------*/

  addBanners: (req, res) => {
    res.render("admin/admin-addBanners", { layout: "admin-layout" });
  },

  /*----------------------------------------------------------------- --*/
  /*                     ADMIN ADD BANNERS IN                           */
  /*-------------------------------------------------------------------*/

  postBannerIn: (req, res) => {
    req.body.banimg = req.files.banimg[0].filename;
    adminHelper.addBannersIn(req.body).then((response) => {
      res.redirect("/admin/addBanners");
    });
  },

  /*----------------------------------------------------------------- --*/
  /*                   GET EDIT BANNER PAGE                            */
  /*-------------------------------------------------------------------*/

  geteditBannerPage: async (req, res) => {
    const bannerDetails = await adminHelper.getbannerDetails(req.query.id);
    res.render("admin/admin-editBanners", {
      layout: "admin-layout",
      bannerDetails,
    });
  },

  /*----------------------------------------------------------------- --*/
  /*                UPDATE BANNER DETAILS                                */
  /*-------------------------------------------------------------------*/

  postEditBannerDetails: async (req, res) => {
    const baneditid = req.query.id;
    if (req.files.banimg == null) {
      banimg = await adminHelper.fetchbanImage1(baneditid);
    } else {
      banimg = req.files.banimg[0].filename;
    }
    req.body.banimg = banimg;
    adminHelper.updateBanner(baneditid, req.body).then(() => {
      res.redirect("/admin/viewBanners");
    });
  },
  //
  /*-------------------------------------------------------------------*/
  /*                            DELETE Banner                       */
  /*-------------------------------------------------------------------*/
  deleteBanners: (req, res) => {
    const bannerId = req.params.id;
    adminHelper.deleteBanners(bannerId).then((response) => {
      res.redirect("/admin/viewBanners");
    });
  },

  /*----------------------------------------------------------------- --*/
  /*                SHOW COUPONS PAGE                                   */
  /*-------------------------------------------------------------------*/

  showCouponsPage: async (req, res) => {
    const coupons = await adminHelper.getAllCoupons();
    res.render("admin/showCoupons", { layout: "admin-layout", coupons });
  },

  /*----------------------------------------------------------------- --*/
  /*                SHOW ADD COUPONS PAGE                              */
  /*-------------------------------------------------------------------*/

  addCoupons: (req, res) => {
    res.render("admin/admin-addCoupons", { layout: "admin-layout" });
  },

  /*----------------------------------------------------------------- --*/
  /*                ADD COUPONS IN                                      */
  /*-------------------------------------------------------------------*/

  postCoupons: (req, res) => {
    adminHelper.addCouponsIn(req.body).then(() => {
      res.redirect("/admin/addCoupons");
    });
  },

  /*----------------------------------------------------------------- --*/
  /*              OFFER MANAGEMENT                                       */
  /*-------------------------------------------------------------------*/

  getOffersList: async (req, res) => {
    const offersList = await adminHelper.getAllCategories();
    adminHelper.getAllCategories().then((categories) => {
      res.render("admin/viewOffers", {
        layout: "admin-layout",
        categories,
        offersList,
      });
    });
  },

  /*----------------------------------------------------------------- --*/
  /*             ADD CATEGORY OFFER                                     */
  /*-------------------------------------------------------------------*/

  addCatgeoryOffer: (req, res) => {
    adminHelper
      .addCategoryOffer(req.body)
      .then((category) => {
        adminHelper
          .getProductForOffer(category)
          .then((products) => {
            products.forEach((element) => {
              adminHelper.addOfferToProduct(req.body, element);
            });
            res.redirect("/admin/viewOffers");
          })
          .catch((error) => {
            res.render("404", { layout: null });
          });
      })
      .catch((error) => {
        res.render("404", { layout: null });
      });
  },

  /*----------------------------------------------------------------- --*/
  /*             ADMIN DELETE CATEGORY OFFER                            */
  /*-------------------------------------------------------------------*/

  adminDeleteOffer: (req, res) => {
    adminHelper
      .deleteCategoryOffer(req.body)
      .then(() => {
        res.json({ status: true });
      })
      .catch((err) => {
        res.status(500).res.render("404", { layout: null });
      });
  },

  /*----------------------------------------------------------------- --*/
  /*             ADMIN DELTE COUPON                                    */
  /*-------------------------------------------------------------------*/

  admindeleteCoupon: (req, res) => {
    const couponId = req.params.id;
    adminHelper.deleteCoupon(couponId).then((response) => {
      res.redirect("/admin/viewCoupons");
    });
  },

  /*----------------------------------------------------------------- --*/
  /*            ADMIN GET EDIT COUPON PAGE                             */
  /*-------------------------------------------------------------------*/

  getEditCouponPage: async (req, res) => {
    const coupons = await adminHelper.getCouponDetails(req.query.id);

    res.render("admin/admin-editCoupon", { layout: "admin-layout", coupons });
  },

  updateCoupon: async (req, res) => {
    adminHelper.updateCouponIn(req.params.id, req.body).then(() => {
      res.redirect("/admin/viewCoupons");
    });
  },

  /*----------------------------------------------------------------- --*/
  /*               SALES REPORT PAGE                                     */
  /*-------------------------------------------------------------------*/

  getAdminSalesReport: async (req, res) => {
    const dailyReport = await adminHelper.getDailySalesReport();
    const monthlyReport = await adminHelper.getMonthlySalesReport();
    const yearlyReport = await adminHelper.getYearlySalesReport();
    res.render("admin/admin-salesReport", {
      layout: "admin-layout",
      dailyReport,
      monthlyReport,
      yearlyReport,
    });
  },

  /*----------------------------------------------------------------- --*/
  /*              DAILY SALES REPORT POST                               */
  /*-------------------------------------------------------------------*/

  getAdminDailySalesReport: async (req, res) => {
    day = req.body.day;
    todate = req.body.toDay;

    const dailySales = await adminHelper.getDailySalesReport(day, todate);
    res.render("admin/admin-salesReport", {
      layout: "admin-layout",
      dailySales,
    });
  },

  getAdminMonthlySalesReport: async (req, res) => {
    const months = req.body.year + "-" + req.body.month;
    const monthlySales = await adminHelper.getMonthlySalesReport(months);
    res.render("admin/admin-salesReport", {
      layout: "admin-layout",
      monthlySales,
    });
  },

  getAdminYearlySalesReport: async (req, res) => {
    const year = req.body.year;
    const yearlySales = await adminHelper.getYearlySalesReport(year);
    res.render("admin/admin-salesReport", {
      layout: "admin-layout",
      yearlySales,
    });
  },
};
