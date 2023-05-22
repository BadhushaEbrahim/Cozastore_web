const { blockUser } = require("../controllers/admin-controler");
const userHelpers = require("../helpers/user-helpers");

module.exports = {
  veryfylogin: (req, res, next) => {
    userHelpers
      .getUserDetails(req.session.user._id)
      .then((user) => {
        if (user.isblocked) {
          req.session.UserLoggedIn = false;
          req.session.user = false;
          swal({
            title: "User Blocked",
            text: "You have been blocked.",
            icon: "warning",
          }).then(() => {
            res.redirect("/userLogout");
          });
        } else {
          req.session.UserLoggedIn = true;
        }
        if (req.session.UserLoggedIn) {
          next();
        } else {
          res.redirect("/userLogout");
        }
      })
      .catch((error) => {
        // Handle error during user details retrieval
        console.error("Error retrieving user details:", error);
        res.redirect("/userLogout");
      });
  },
};
