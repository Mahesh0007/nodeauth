var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User=require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register',{title :'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title : 'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'}),
  function(req, res) {
    req.flash('success','You are now logged in!');
    res.redirect('/');
    console.login("Login Working!...");
  });

  passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

  passport.use(new LocalStrategy(function(username,password,done){
    User.getUserByUsername(username,function(err,user){
      console.log("user object  is : "+user);

      if(err) throw err;
      if(!user){
        return done(null,false,{message:'Unknown user'});
      }
      User.comparePassword(password,user.password,function(err,isMatch){
        console.log("Value of isMatch is :"+isMatch);
        console.log("user.password is : "+user.password);
        if(err) return done(err);
        if(isMatch){
          return done(null,user);
        }else{
          return done(null,false,{message : 'Invalid Password'});
        }
      });
    });
  }));
router.post('/register', upload.single('profileimage'),function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var passowrd2 = req.body.password2;
  //res.writeHead(200,{"Content-Type" : "application/json"});
  if(req.file){
    console.log("Uploading File...");
    var profileimage = req.file.filename;
  }else{
    console.log("No File Uploaded..");
    var profileimage = 'noimage.jpg';
  }
// form validator
req.checkBody('name','Name field required').notEmpty();
req.checkBody('email','Email field required').notEmpty();
req.checkBody('email','Email Not Valid!').isEmail();
req.checkBody('username','userName field required').notEmpty();
req.checkBody('password','Password field required').notEmpty();
req.checkBody('password2','password do not match!').equals(req.body.password);
req.checkBody('name','Name field required').notEmpty();
var errors = req.validationErrors();
if(errors){
  res.render('register',{
    errors : errors
    });
}else{
  var newUser=new User({
    name : name,
    email : email,
    username : username,
    password:password,
    profileimage : profileimage
  });
  User.createUser(newUser,function(err,user){
    if(err) throw err;
    console.log(user);
  });
  req.flash('Success','You are now registered and can login');
  res.location('/');
  res.redirect('/');
}
});

router.get("/logout",function(req,res){
  req.logout();
  req.flash('success','you are now logged out!');
  res.redirect('/users/login');
});

module.exports = router;
