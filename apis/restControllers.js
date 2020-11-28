const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const router = express.Router();
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys =require('../../config/keys');
const { socketEvents } = require('../../config/io');
const { ensureAuthentication , verifyToken} = require('../../config/middleware');
const sendMail = require('../../mailer/sendMail');
const {newTransactionMailer } = require('../../mailer/template')
//models
const User= require('../../model/user');
const Transaction= require('../../model/transactions');

router.get('/admin-dashboard',verifyToken,(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
      if(err){
          res.sendStatus(403);
      }else{
           await Transactions.find({}, null, { sort: 'startDate' },(err, transactions)=>{
               if(err){
                   res.json(err);
               }
             res.json(transactions)
           });
      }
  });
});

router.get('/transctions',verifyToken,(req,res)=>{
    jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
        if(err){
            res.sendStatus(403);
        }else{
             await Transactions.find({}, null, { sort: 'date' },(err, transactions)=>{
                 if(err){
                     res.json(err);
                 }
               res.json(transactions)
             });
        }
    });
});

router.post('/add-transctions',verifyToken,(req,res)=>{
 jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
      if(err){
          res.sendStatus(403);
      }else{ 
        const now = new Date();
        const sufix1 = req.body.senderName.slice(1,3);
        const sufix2 = req.body.receiverName.slice(3,5);
        const sec = new Date().getSeconds();
        const ms = now.getMilliseconds();
        const transaction_code = (sufix1+sec+sufix2+ms).toUpperCase();
        const newTransaction = new Transaction({
          amount : req.body.amount,
          transaction_code: transaction_code,
          agentCode : req.body.agentCode,
          senderName : req.body.senderName,
          agentCode : req.body.agentCode.toLowerCase(),
          senderID : req.body.senderID,
          senderNumber:req.body.senderNumber,//.toLowerCase(),
          senderAddress : req.body.senderAddress,
          receiverName:req.body.receiverName,
          receiverNumber:req.body.receiverNumber,
          receiverID:req.body.receiverID,
          receiverAddress:req.body.receiverAddress,
          status : "Pending"
        });
        
        Transaction.createTransaction(newTransaction,(err)=>{
          if (err) {
            res.json(err);
          }else{
            sendMail(newTransactionMailer, newTransaction)
            res.json({
              'code':0,
              'msg': 'success',
              'data':newTransaction
            });
          }
        });
      }
    });
});

router.get('/view-transaction/:transaction_code', verifyToken,async(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
         await Transaction.findOne({transaction_code:req.params.transaction_code},(err, transaction)=>{
           console.log(req.params.transaction_code)
             if(err){
                 res.json(err);
             }
             if(!transaction){
               res.json({
                 'code':100,
                 'msg':"NO transaction"
               })
             }else{
              res.json({
                'code':0,
                'data' :transaction
              });
             }
         });
    }
  });
});

router.get('/clear-transaction/:transaction_code', verifyToken,async(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
      await Transaction.updateOne({transaction_code:req.params.transaction_code},{$set:{status:"complete"}},(err, transaction)=>{
        if(err){
            res.json(err);
        }
        res.json(transaction)
      });
    }
  });
});

router.get('/view-transaction-history/:agent_code/:view_type', verifyToken,(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
      Transaction.find({/*agentCode:req.params.agent_code*/},(err, transactions)=>{
        if(err){
            res.json(err);
        }
        if(req.params.view_type == "history"){
            const date = 
            transactions.forEach(element=>{});
        }
        console.log(transactions)
        res.json(transactions)
      });
    }
  });
});


router.post('/add-agent', verifyToken,(req,res)=>{});

router.get('/all-agents', verifyToken,(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
         await User.find({}, null, { sort: 'startDate' },(err, agents)=>{
             if(err){
                 res.json(err);
             }
           res.json(agents)
         });
    }
  });
});

router.get('/view-agent/:id', /*verifyToken,*/async(req,res)=>{
  /*jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{*/
         await User.findOne({agentCode:req.params.id}, (err, agent)=>{
             if(err){
                 res.json(err);
             }
           res.json(agent)
         });
    /*}
  });*/
});

router.get('/view-devices/:id', /*verifyToken,*/async(req,res)=>{
  /*jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{*/
         await User.find({$or:[{agentCode:req.params.id},{email:req.params.id}]}, (err, devices)=>{
             if(err){
                 res.json(err);
             }
           res.json(devices)
         });
    /*}
  });*/
});

router.get('/check-device/:id', verifyToken,(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
         await User.find({id:req.params.id}, (err, agent)=>{
             if(err){
                 res.json(err);
             }
           res.json(agent)
         });
    }
  });
});

router.post('/add-device/:id', verifyToken,(req,res)=>{
  jwt.verify(req.token, keys.jwtkey.secret, async(err)=>{
    if(err){
        res.sendStatus(403);
    }else{
         await User.find({id:req.params.id}, (err, agent)=>{
             if(err){
                 res.json(err);
             }
           res.json(agent)
         });
    }
});
});



module.exports= router;