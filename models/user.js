var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;
var bcrypt = require('bcryptjs');

//user Schema
var UserSchema = mongoose.Schema({
  username : {
    type :String,
    index: true
  },
  password:{
    type : String
  },
  email:{
    type : String
  },
  name:{
    type : String
  },
  profileimage:{
    type : String
  }
  });
var User= module.exports=mongoose.model('User',UserSchema);

module.exports.createUser=function(newUser,callback){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newUser.password,salt,function(err,hash){
      newUser.password=hash;
      newUser.save(callback);

    });
  });
}

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}
module.exports.getUserByUsername = function(username,callback){
  console.log("indside getUserByUsername impl., username is :"+username);
  var query ={username:username};
  User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
  console.log("indside comparePassword impl., candidatePassword is :"+candidatePassword);
  console.log("hash of the password is  :"+hash);
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

  callback(null,isMatch);
});
}
