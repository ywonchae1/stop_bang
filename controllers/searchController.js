const db = require("../config/db");
const searchModel = require('../models/searchModel');


//컨트롤러 함수에서는 데이터베이스에서 부동산중개업소 정보를 조회하는 비즈니스 로직을 수행


exports.getAgency = async(req,res) => {
    const sgg_nm = req.query.sgg_nm;
    const bjdong_nm = req.query.bjdong_nm;
    const ra_regno = req.query.ra_regno;

    console.log(`get agencies // sgg_nm: ${sgg_nm}, bjdong_nm: ${bjdong_nm}`);

    try {
        const rows = await searchModel.getAgenciesModel(sgg_nm, bjdong_nm);
        res.json({ rows: rows });
    } catch (err) {
        console.error(err.stack)
    }
};

// 중개업소 정보 조회 API
exports.getOneAgency = async(req, res) => {
  

    const sgg_nm = req.query.sgg_nm;
    const bjdong_nm = req.query.bjdong_nm;
    const cmp_nm = '%'+req.query.cmp_nm+'%';

    try {
            const rows = await searchModel.getOneAgencyModel(sgg_nm,bjdong_nm,cmp_nm);
                 console.log('*****An agency info : ', rows);
                 res.json({ rows: rows });
        } catch (err) {
        console.error(err.stack)
    }
    

};

