module.exports = {
    veryfylogin: (res, req, next) => {
        if (req.session.UserLoggedIn) {
            next()
        }
        else {
            res.redirect('/logout')
        }
    }
}