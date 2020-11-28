const User = require('../model/user');
///Token verification
module.exports.verifyToken=(req, res, next)=>{
  //Get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
      req.token =bearerHeader.split(' ')[1];
      next();

  }else{
    //Forbidden
    res.sendStatus(403);
  }
}

  ///check authentication
module.exports.checkAuthentication=(req, res, next)=>{
  if(req.isAuthenticated()){
    if(req.user.role =="Admin"){
      return next();
    }else{
      res.redirect('/errors/404');
    }
  }else{
    res.redirect('/errors/404');
  }
}

  ///check authentication
  module.exports.checkAdmin=(req, res, next)=>{
    User.findOne({role:'Admin'},(err,user)=>{
      if(err) throw err;
      if(!user){
        res.redirect('/auth/admin-register');
      }else{
        return next();
      }
    });
  }