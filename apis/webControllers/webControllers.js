const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require ('passport');
const user = require('../../model/user');
const Transaction = require('../../model/transactions');
const router = express.Router();
const sendMail = require('../../mailer/sendMail');
const { newTransactionMailer } = require('../../mailer/template')
const {checkAuthentication, checkAdmin} = require('../../config/middleware');
const { json } = require('body-parser');


router.get('/',checkAdmin,(req,res)=>{
    let alert ={
        'alert' : false,
    }
    res.render('./homefiles/index',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert
    })
});

router.get('/request-to-be-agent',checkAdmin,(req,res)=>{
    let alert ={
        'alert' : false,
    }
    res.render('./homefiles/request-to-be-agent',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert
    })
});

router.get('/admin-dashboard',checkAuthentication,(req,res)=>{
    let alert ={
        'alert' : false,
    }
    res.render('./homefiles/admin/admin-dashboard',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert,
        user : req.user
    })
});

router.get('/add-agent',checkAuthentication,(req,res)=>{
    let alert ={
        'alert' : false,
    }
    res.render('./homefiles/admin/add-agent',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert,
        user : req.user
    })
});

router.get('/all-users',checkAuthentication,(req,res)=>{
    user.find({},(err, users)=>{
        let alert ={
            'alert' : false,
        }
        res.render('./homefiles/admin/view-users',{
            users: users,
            isAuthenticated: req.isAuthenticated(),
            alert :alert,
            user : req.user
        });
    });
});

router.get('/all-transactions',checkAuthentication,(req,res)=>{
    Transaction.find({},(err, transactions)=>{
        let alert = {
            'alert' : false,
        }
        res.render('./homefiles/admin/view-transactions',{
            transactions: transactions,
            isAuthenticated: req.isAuthenticated(),
            alert : alert,
            user : req.user
        });
    });
});

router.post('/add-transctions',checkAuthentication,(req,res)=>{
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
            agentCode : req.user.agentCode.toLowerCase(),
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
                res.render('/error/500');
            }else{
                Transaction.find({},(err, transactions)=>{
                    alert = {
                        'alert' : true,
                        'type' : 'success',
                        'title' : 'Successful',
                        'msg' : 'Successfuly send moneny to '+newTransaction.receiverName
                    }
                    res.render('./homefiles/admin/view-transactions',{
                        transactions: transactions,
                        isAuthenticated: req.isAuthenticated(),
                        alert:alert,
                        user : req.user
                    });
                });
            }
        });
   });

router.get('/view-transaction/:transaction_code', checkAuthentication,async(req,res)=>{
    await Transaction.findOne({transaction_code:req.params.transaction_code},(err, transaction)=>{
          if(err){
              res.json(err);
          }
          if(!transaction){
            res.json({
              'code':100,
              'msg':"No transaction with that refference"
            })
          }else{
           res.json({
             'code':0,
             'data' :transaction
           });
          }
      });
});

router.get('/clear-transaction/:transaction_code', checkAuthentication,async(req,res)=>{
    
    await Transaction.updateOne({transaction_code:req.params.transaction_code},{$set:{status:"complete"}},(err, transaction)=>{
        if(err){
            res.json(err);
        }
        res.json({
            "code" : 0,
            "msg": "Successfully cleared"
        })
    });
});

router.get('/delete-record/:id/:entity_type', checkAuthentication,async(req,res)=>{
    console.log(req.params.entity_type);
    if(req.params.entity_type == "transaction"){
        console.log(req.params.entity_type)
        Transaction.deleteOne({transaction_code:req.params.id},(err)=>{
            if(err){
                res.json({
                    'code': 500,
                    'msg' : "Error deleting transaction record"
                });
            }else{
                res.json({
                    'code' : 0,
                    'msg' : "Transaction successfully deleted"
                });
                
            }
        });
    }else if(req.params.entity_type == "user"){}
});
module.exports = router; 
