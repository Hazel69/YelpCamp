// require module
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//declare object to hold all middlewares
var middlewareObj = {};

//check campground owener ship

//check comment owern ship

//check whether the user has logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); //if logged in, go to requested page
    } else {
        res.redirect("/login"); //else go to login page
    }
    
}

//check whether current campground post is belonged to the user
middlewareObj.checkCampOwnership = function (req, res, next) {
    // body...
    //TODO 
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            // body...
            if(err) {
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
            
        });
        
    } else {
        res.redirect("back");
    }
}

//check whether current comment post is belonged to the user
middlewareObj.checkCommentOwnerShip = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}


//exports the middleware

module.exports = middlewareObj;