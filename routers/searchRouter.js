const express = require('express');
const router = express.Router();
const db = require("../config/db");
const searchControl = require("../controllers/search/searchController");

const gu_options =["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"]

router.get('/',(req,res,next)=>{
    res.render('search', {gu_options:gu_options});

});


router.get("/agencies",searchControl.getAgency);
router.get("/agencyName",searchControl.getOneAgency);


    

module.exports = router;