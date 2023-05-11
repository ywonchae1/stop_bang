const express = require('express');
const db = require("../config/db");
const router = express.Router();


//컨트롤러 함수에서는 데이터베이스에서 부동산중개업소 정보를 조회하는 비즈니스 로직을 수행


// 중개업소 정보 조회 API
exports.getAgency = async(req, res) => {
  

    const sgg_nm = req.query.sgg_nm;
    const bjdong_nm = req.query.bjdong_nm;

    console.log(`sgg_nm: ${sgg_nm}, bjdong_nm: ${bjdong_nm}`);

    try {
        const query = `SELECT * FROM agencies WHERE sgg_nm = ? AND bjdong_nm = ?`;
            
            //await는 호출된 함수가 결과를 반환할 때까지 기다리며, 반환된 결과를 변수에 할당. 비동기 함수의 실행이 완료될 때까지 대기하지 않고 다음 코드를 실행
           //https://github.com/mysqljs/mysql#performing-queries
            const rows = await db.query(query, [sgg_nm, bjdong_nm],(error,rows,fields)=>{              if (error) throw error;
                 console.log('agencies enfo ', rows);
                 res.json({ rows: rows });

            });
            
        } catch (err) {
        console.error(err.stack)
    }
    

};


// 중개업소 정보 조회 API
exports.getOneAgency = async(req, res) => {
  

    const sgg_nm = req.query.sgg_nm;
    const bjdong_nm = req.query.bjdong_nm;
    const cmp_nm = '%'+req.query.cmp_nm+'%';

    console.log('searching an agency...........');
    console.log(`sgg_nm: ${sgg_nm}, bjdong_nm: ${bjdong_nm}, cmp_nm: ${cmp_nm}`);

    try {
        const query = `SELECT * FROM agencies WHERE sgg_nm = ? AND bjdong_nm = ? AND cmp_nm LIKE ?`;
            
            //await는 호출된 함수가 결과를 반환할 때까지 기다리며, 반환된 결과를 변수에 할당. 비동기 함수의 실행이 완료될 때까지 대기하지 않고 다음 코드를 실행
           //https://github.com/mysqljs/mysql#performing-queries
            const rows = await db.query(query, [sgg_nm, bjdong_nm, cmp_nm],(error,rows,fields)=>{              
                if (error) throw error;
                 console.log('*****An agency info : ', rows);
                 res.json({ rows: rows });

            });
            
        } catch (err) {
        console.error(err.stack)
    }
    

};

