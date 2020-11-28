const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, checkAdmin, checkAuthentication } = require('../../config/middleware');
const jwt = require('jsonwebtoken');
const sendMail = require('../../mailer/sendMail');
const {newUserSignup, changePassword} = require('../../mailer/template');
const keys = require('../../config/keys');
/*const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: keys.nexmo.apiKey,
    apiSecret: keys.nexmo.apiSecret,
  });*/
//models
const User= require('../../model/user');
const { uploadProfile }= require('../../model/images');

///Endle google handler
//acount verification
router.get('/admin-register', (req, res)=>{
    res.render('./homefiles/admin/register',{
        isAuthenticated:req.isAuthenticated(), 
        layout:false
    });
});

///Endle google handler
//acount verification
router.get('/artist-verify-account'/*, ensureAuthentication*/, (req, res)=>{
    res.render('./homefiles/accountVerification/artist',{
        user:req.user, 
        layout:"./layouts/verifyAccount.handlebars"
    });
});

router.get('/update-profile/:field/:value', verifyToken, (req, res)=>{
    jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
        if (err){
            res.sendStatus(403);
        }else{
            
             const field = req.params.field;
             const value = req.params.value;
             let myMap = new Map().set(field, value);
             if(field =="address" ||
              field=="contact" ||
              field =="altcontact" ||
              field=="next_of_keen" ||
              field == "next_of_keen_contact" ||
              field=="next_of_keen_address" ||
              field=="city" ||
              field =="country"){
                const query = {$set:{address:strMapToObj(myMap)}}
                User.updateOne({agentCode : 'kk24962020'}, query,()=>{
                    console.log('done')
                    User.findOne({agentCode: 'kk24962020'}, (err, agent)=>{
                     if(err){
                         res.json(err);
                     }
                   res.json(agent)
                 });
                });
              }else if(field == "facebook" || field =="twitter" || field=="instagram" ){
                const query = {$set:{socialNetwork:strMapToObj(myMap)}}
                User.updateOne({agentCode : 'kk24962020'}, query,()=>{
                    console.log('done')
                    User.findOne({agentCode: 'kk24962020'}, (err, agent)=>{
                     if(err){
                         res.json(err);
                     }
                   res.json(agent)
                 });
                });
              }else{
                const query = {$set:strMapToObj(myMap)}
                User.updateOne({agentCode : 'kk24962020'}, query,()=>{
                    console.log('done')
                    User.findOne({agentCode: 'kk24962020'}, (err, agent)=>{
                     if(err){
                         res.json(err);
                     }
                   res.json(agent)
                 });
                });
              }
        }
    });
});
 //End account verification

//Register user
router.post('/sign-up',[
    check('email').isEmail(),
],(req, res)=>{
    
                
    uploadProfile(req,res,(err)=>{
        if(err) throw err;
        User.findOne({email:req.body.email},(err,user)=>{
            if(err) throw err;
            if(!user){
                if (req.body.type == 5673) {
                    const newUser = new User({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        agentCode : req.body.agentCode.toLowerCase(),
                        address:[{
                            address:req.body.address,
                            contact : req.body.contact,
                            altcontact : req.body.altcontact,
                            next_of_keen : req.body.next_of_keen,
                            next_of_keen_contact : req.body.next_of_keen_contact,
                            next_of_keen_address : req.body.next_of_keen_address,
                            city : req.body.city,
                            relationship : req.body.relationship,
                        }],
                        password : req.body.password,
                        email:req.body.email.toLowerCase(),
                        role : "Admin",
                        active:true,
                        avatar:req.file.filename,
                    });
                    User.createUser(newUser,(err)=>{
                        if (err) throw err;
                        const alert = "alert alert-success";
                        const msg = "Successfully added";
                        sendMail(newUserSignup,newUser);
                        const text = 'Hello, from sendMoney app. An account with the following credentials have been created; agentCode: '+newUser.agentCode+ 'and password: '+newUser.password ;

                        //nexmo.message.sendSms(from, to, text);
                        res.render('./homefiles/index',{
                            alert:alert,
                            msg: msg,
                            isAuthenticated:req.isAuthenticated(),
                        });
                    });
                }else{
                    const newUser = new User({
                        firstname : req.body.firstname,
                        lastname : req.body.lastname,
                        agentCode : req.body.agentCode.toLowerCase(),
                        address:[{
                            address:req.body.address,
                            contact : req.body.contact,
                            altcontact : req.body.altcontact,
                            next_of_keen : req.body.next_of_keen,
                            next_of_keen_contact : req.body.next_of_keen_contact,
                            next_of_keen_address : req.body.next_of_keen_address,
                            city : req.body.city,
                            relationship : req.body.relationship,
                        }],
                        password : req.body.password,
                        email:req.body.email.toLowerCase(),
                        role : "Agent",
                        active:false,
                        avatar:req.file.filename,
                    });
                    User.createUser(newUser,(err)=>{
                        if (err) throw err;
                        const alert = "alert alert-success";
                        const msg = "Successfully added";
                        sendMail(newUserSignup,newUser);
                        const from = 'Vonage APIs';
                        const to = '263779710095';
                        res.render('./homefiles/index',{
                            alert:alert,
                            msg: msg,
                            isAuthenticated:req.isAuthenticated(),
                        });
                    });
                }
            }else{
                alert ={
                    "code":100
                }
                res.render('./homefiles/index',{
                    alert:"alert alert-danger",
                    msg:"Please log in to the system",
                    isAuthenticated:req.isAuthenticated(),
                })
            }
        });
    });
//}
});

//Password management
router.get('/password-settings',verifyToken, [
    // password must be at least 5 chars long
    check('pwd').isLength({ min: 5 })
    .withMessage('The password must be 5+ chars long and contain a number')
    .matches(/\d/)
    .withMessage('must contain a number')
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.pwd1) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })
  ], (req, res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }else{
        User.getUserById(req.user.id, (err, user)=>{
            if (err) throw err;
            if(user){
                var pwd =req.body.pwd;
                User.comparePassword(req.body.cpwd, user.password, (err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                      bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(pwd, salt, (err, hash)=>{
                            pwd= hash;
                          User.updateOne({_id:req.user.id},{$set:{ password:pwd}} , (err)=>{
                            if (err) throw err;
                            if(user.role =="Admin"){
                                res.render('./admin/admin-dashboard',{
                                    user:user,
                                    msg:"Successfully changed your password",
                                    alert:"alert  alert-success"
                                });
                            }
                          });
                        });
                      });
                    }else{
                      const msg ="Current Passwords do not match";
                      res.json(msg);
                      /*res.render('./admin/admin-dashboard',{
                        alert:"danger",
                        layout:layout,
                        msg:msg
                      });*/
                    }
                  });
            }else{
                return res.status(422).json("Error changing password");
            }
        });
    }
});

//Password management
router.post('/reset-password', [
    // password must be at least 5 chars long
    check('newPassword').isLength({ min: 5 })
    .withMessage('The password must be 5+ chars long and contain a number')
    .matches(/\d/)
    .withMessage('must contain a number')
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.passwordAgain) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })
  ], (req, res)=>{
      console.log("hello")
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("errors")
      return res.status(422).json({ errors: errors.array() });
    }else{
        
        User.findOne({email:req.body.identifier}, (err, user)=>{
            if (err) throw err;
            if(user){
                console.log(req.body)
                var pwd =req.body.newPassword;
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(pwd, salt, (err, hash)=>{
                        pwd= hash;
                      User.updateOne({email:req.body.identifier},{$set:{ password:pwd}} , (err)=>{
                        if (err) throw err;
                        var url= 'http://localhost:3000/auth/sign-in'
                        var token = user.generateJwt(url);
                        res.json({
                            "code":200,
                            "msg" : "Successfull",
                            "access_token" : token
                        })
                      });
                    });
                  });
            }else{
                return res.status(422).json("Error changing password");
            }
        });
    }
});

router.get('/check-user/:identifier',(req,res)=>{
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    var resetCode = Math.floor(100000 + Math.random() * 900000);
    var query = {$set:{"code.expiry":now, "code.code":resetCode}};
    User.getUserByUsername(req.params.identifier, (err,user)=>{
        if(err) throw err;
        if(user){
            User.updateOne({_id : user._id}, query, (err)=>{
                if (err) throw err;
                const name = user.firstname +" "+ user.lastname;
                const email = user.email;
                sendMail(changePassword,{name, email, resetCode});
                res.json({
                    "code" : 200,
                    "msg" : "success", 
                    "identifier" : email,
                    "reset_code" :resetCode,
                    "expire_date" : now
                });
            });
        }else{
            res.json({
                "code":201,
                "msg" :"User doesnot exit"
            });
        }
    });
});

router.get('/check-resetCode/:identifier',(req,res)=>{
    console.log("oky")
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    User.findOne({"code.code":req.params.identifier}, (err,user)=>{
        if(err) throw err;
        if(user){
            res.json({
                "code": 200,
                "msg": "success",
                "identifier" : user.email
            })
        }else{
            res.json({
                "code":201,
                "msg" :"Code does not exist"
            });
        }
    });
});

//Log user in
router.post('/sign-in', passport.authenticate('local',{failureRedirect: '/auth/sign-in-failer'}),
    (req, res)=>{
        var url= 'http://localhost:3000/auth/sign-in'
        var token = req.user.generateJwt(url);
        res.json({
          "access_token" : token,
        });
    }
);

//Log user in
router.get('/sign-in-failer',
    (req, res)=>{
        res.json({
            "code":"401",
            "msg" : "Either password or email incorrect",
        });
    }
);

//web login
router.post('/web-sign-in', passport.authenticate('local',{ failureRedirect: '/', failureMessage:'Error auth' }),
(req,res)=>{
    if(req.user.role =="Admin"){
        res.redirect('/admin-dashboard');
    }else{
        req.logout();
        res.render('/homefiles/index',{
            isAuthenticated:req.isAuthenticated()
        });
    }
});

//web login
router.get('/web-sign-out', checkAuthentication,
(req,res)=>{
    req.logout();
    res.redirect('/');
});

//sign-out 
router.get('/sign-out', verifyToken, (req,res)=>{
    req.logout();
    res.json({
        code:0,
        msg:"Success",
    });
});

function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
  }

module.exports = router;