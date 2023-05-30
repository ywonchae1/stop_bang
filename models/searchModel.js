// model.js
const db = require("../config/db");

exports.getAgenciesModel = async (sgg_nm, bjdong_nm) => {
  //console.log(`MODEL get agencies // sgg_nm: ${sgg_nm}, bjdong_nm: ${bjdong_nm}`);

  try {
    const query = `  select a.ra_regno, a.cmp_nm, a.address, a.telno, a.rdealer_nm, a.sgg_nm, a.bjdong_nm, a.sgg_nm ,ifnull(round(avg(r.rating),0),0) as avg_rating , ifnull(count(r.content),0)  as countReview from agentList a left outer join review r on a.ra_regno = r.agentList_ra_regno where sgg_nm = ? AND bjdong_nm = ?  group by a.ra_regno ;;`;
    const [rows, fields] = await db.query(query, [sgg_nm, bjdong_nm]);
    console.log("agentList info ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
    throw err;
  }
};

// 중개업소 정보 조회  
exports.getOneAgencyModel = async (sgg_nm, bjdong_nm, cmp_nm) => {
  try {
    const query = `  select a.ra_regno, a.cmp_nm, a.address, a.telno, a.rdealer_nm, a.sgg_nm, a.bjdong_nm, a.sgg_nm ,ifnull(round(avg(r.rating),0),0) as avg_rating , ifnull(count(r.content),0)  as countReview from agentList a left outer join review r on a.ra_regno = r.agentList_ra_regno where sgg_nm = ? AND bjdong_nm = ? AND cmp_nm LIKE ?  group by a.ra_regno ;;`;
    const [rows, fields] = await db.query(query, [sgg_nm, bjdong_nm, cmp_nm]);
    //console.log("An agency info : ", rows);
    return rows;
  } catch (err) {
    console.error(err.stack);
  }
};
