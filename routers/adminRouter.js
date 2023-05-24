const express = require('express');
const router = express.Router();
const db = require("../config/db");
const adminControl = require("../controllers/adminController");


router.get('/',(req,res,next)=>{

    const rows = adminControl.getNewUsersCount().then(result=>{
        const userCount =  result[0].userCount; 
        res.render('admin',{userCount:userCount});
        return userCount; 

}).catch(error => {
    console.error(error); 
    throw error; 
  });
  

});
module.exports = router;
