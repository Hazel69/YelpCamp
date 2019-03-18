const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", function(req, res) {
    res.render("landing");
})


//============Auth Routes===========
router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res) {
    var user = new User({username:req.body.username});
    User.register(user, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//log in 
router.get("/login", function(req, res) {
    res.render("login");
});

// app.post("/login", middleware, callback());
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), 
    function(req, res) {
            req.flash("success","Success.");
});

//log out
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Success.")
    res.redirect("/campgrounds");
})



//=============Auth Routes End=======


module.exports = router;