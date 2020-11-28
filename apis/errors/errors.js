const express = require('express');
const router = express.Router();
let alert ={
    'alert' : false,

}

router.get('/404',(req,res)=>{
    res.render('./homefiles/errors/404',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert
    })
});

router.get('/500',(req,res)=>{
    
    res.render('./homefiles/errors/500',{
        isAuthenticated: req.isAuthenticated(),
        alert : alert
    })
});

module.exports = router;
