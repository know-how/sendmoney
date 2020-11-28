const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys= require('./keys');
const {google} = require('googleapis');


//models
const User = require('../model/user');

module.exports = function(passport){
  /// serialize and deserialize starts
  passport.serializeUser((obj, done) => {
    if(obj instanceof User) {
      done(null, { id: obj.id, type: 'User'});
    } 
  });

  passport.deserializeUser((obj, done) => {
    if  (obj.type === 'User') {
      //User
      User.getUserById(obj.id,function(err, user){
        done(err, user);
      });
    }
  });

  ////Local strategy
    passport.use(new LocalStrategy({usernameField : 'identifier'},(identify, password, done) =>{
      //Check
      
      var identifier= identify.toLowerCase();
      User.getUserByUsername(identifier, function(err, user){
        if (err) throw err;
          if(!user){
            return done(null, false, {msg:"Unkown user"});
          }else {
            User.comparePassword(password, user.password, function(err, isMatch){
              if(err) throw err;
              if(isMatch){
                return done(null, user);
              } else{
                return done(null, false, {msg: 'Either username/password is Invalid'});
              }
          });
        }
      });
    }));
}
