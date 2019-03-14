var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("loval")(req, res, function() {
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
        res.send("You are log in!");
});

//log out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})



//=============Auth Routes End=======


module.exports = router;