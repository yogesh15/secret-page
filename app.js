var express             = require('express'),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    bodyParser          = require("body-parser"),
    User                = require("./models/user"),
    LocalStrategy       = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
mongoose.connect("mongodb://localhost:27017/auth_demo",{ useNewUrlParser: true });
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "rusty is best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ROUTES 
app.get("/",function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
});

//=================//
//AUTH ROUTES
//=================//

//show sign up form
app.get("/register",function(req,res){
    res.render("register");
});
//handling sign up
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}),req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }//this actually logs the user in
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
    });
});
//login routes
app.get("/login",function(req,res){
    if(req.isAuthenticated()){
        res.render("secret");
    }
    else{
        res.render("login");
    }
});

//login logic
//middleware
app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000,function(){
    console.log("server has started");
});