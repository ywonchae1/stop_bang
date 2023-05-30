const express = require('express');
const router = express.Router();
const db = require("../config/db");
const adminControl = require("../controllers/adminController");


/*router.get('/',(req,res,next)=>{

    const rows = adminControl.getNewUsersCount().then(result=>{
        const userCount =  result[0].userCount; 


        res.render('admin',{userCount:userCount});
      
        return userCount; 

}).catch(error => {
    console.error(error); 
    throw error; 
  });
  

});*/

router.get('/',async(req,res,next)=>{

  try{
    const result1 = await adminControl.getNewUsersCount();
    const result2 = await adminControl.getNewAgent();
    //const result3 = await adminControl.getInactiveUsersCount();

    const userCount =  result1[0].userCount; 
    const newAgent = result2;
    console.log("user count : "+userCount, "new agent : "+newAgent);
    res.render('admin', { userCount : userCount,newAgent:newAgent});



  }catch(error){
    console.log(error);
  }

});
module.exports = router;
