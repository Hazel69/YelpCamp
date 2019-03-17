var express     = require("express"),
    session     = require("express-session"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    methodOverride = require("method-override"), //used for put and delete request
    port = 8888,
    flash = require("connect-flash"); 
    
//requiring routes
var indexRoutes = require("./routers/index"),
    campgroundRoutes = require("./routers/campgrounds"),
    commentRoutes = require("./routers/comments");

mongoose.connect("mongodb://localhost/yummy", { useNewUrlParser: true });
//set the view engine
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));//we will override unscore method
app.use(flash()); //used for some pop info box, need to be used before passort



//====================Passport Configuration===========
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
//if we do not plugin the passportLocalMongoose in our user model,we will 
//need to write the method in new LocalStrategy;
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
 //================Passport Configuration Finished=======
 
 //make current user 
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;//used in ejs
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// these lines should be at the bottom of the filr
// for some middleware to be defined
app.use("/", indexRoutes);
//the first param indicate that all the routes in campgroundRoutes will start with "/campgrounds"
app.use("/campgrounds/",campgroundRoutes);

app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(8888, function() {
    console.log("The yelp server has started");
});