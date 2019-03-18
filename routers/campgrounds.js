const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware/index");

//show all the campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{ campgrounds: campgrounds });
        }
    })
      
})

//create new campground when logged in
router.post("/", middleware.isLoggedIn, function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.desc;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, image: image, desc: desc, author: author};
   Campground.create(newCampground, function(err, newCampground) {
       if(err) {
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   });
});

//show the form to create new Campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


//show one specific campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err||!foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
             res.render("campgrounds/show", {campground: foundCampground});
        }
    });
   
});


//edit
//first check whether the campground post is belonged to the request user
router.get("/:id/edit",middleware.checkCampOwnership, function(req,res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campgrounds/edit", {campground: foundCampground}); 
   });
   
});

//update the information about specific campground
router.put("/:id", middleware.checkCampOwnership, function(req, res) {
    console.log(req);
    // find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        // body...
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

//Delete the campground
router.delete("/:id", middleware.checkCampOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
