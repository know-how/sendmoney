const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const SocialNetworkSchema = mongoose.Schema({
    googleId:{
        type:String
      },
      facebookId:{
        type:String
      },
      facebook:{
        type: String,
        //unique: true,
        trim: true
      
      },
      twitter:{
        type: String,
        //unique: true,
        trim: true
      
      },
      instagram:{
        type: String,
        //unique: true,
        trim: true
      
      },
});

const AddressSchema = mongoose.Schema({
    address:{
        type:String
      },
    contact:{
      type:String
    },
    altcontact:{
        type:String
    },
    next_of_keen:{
      type:String
    },
    next_of_keen_contact:{
      type:String
    },
    next_of_keen_address:{
      type:String
    },
    relashionship:{
      type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
});

const PackageSchema = mongoose.Schema({
  pname:{
      type:String
    },
});

//User Schema
const UserSchema = mongoose.Schema({
  
    firstname:{
      type: String,
  
    },
    email:{
      type: String,
      //unique: true,
      trim: true
    
    },
    lastname:{
      type: String,
  
    },
    agentCode:{
      type: String,
      //unique: true,
      //trim: true
  
    },
    address:[
        AddressSchema
    ],
    socialNetwork:[
      SocialNetworkSchema
    ],
    role:{
      type:String,
    },
    package:{
      type:PackageSchema
    },
    active:{
      type: Boolean
    },
    password:{
      type: String,
    },
    biography:{
      type: String,
    },
    code:{
      expiry:{
        type:String,
      },
      code :{
        type: Number
      } 

    },
    avatar: {
  
        type: String
    },
    blocked: { 
      type: Boolean, 
      default: true 
    },
  }, { timestamps: true });

  UserSchema.methods.generateJwt = function(url) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    //expiry.setSeconds(expiry.getDate() + 7);
  
    return jwt.sign({
      iss : url,
      _id: this._id,
      email: this.email,
      agentCode:this.agentCode,
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      firstname: this.firstname,
      package: this.package,
      active: this.active,
      role: this.role,
      address: this.address,
      socialNetwork: this.socialNetwork,
      avatar: this.avatar,
      blocked: this.blocked,
      description:this.description,
      exp: parseInt(expiry.getTime() / 1000),
    }, keys.jwtkey.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };
  
const User = module.exports = mongoose.model('User', UserSchema);
//Create new user
module.exports.createUser = (newUser, callback)=>{
bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
    newUser.password = hash;
    newUser.save(callback);
    });
});
}

//Get username
module.exports.getUserByUsername =  (identify, callback)=>{
const query = {$or:[{agentCode : identify},{email:identify} /*{socialNetwork:{$elemMatch:{email:username}}}*/] };
User.findOne(query, callback);

}

//Get userId
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

  //Get password and compare
module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
