//db정보받기
const db = require("../config/db.js");

module.exports = {
  getReviewByRaRegno: async (params, result) => {
    let rawQuery = `
	SELECT rv_id, r_username, A.rating AS rating, content, cmp_nm, ra_regno, DATE_FORMAT(A.created_time,'%Y-%m-%d') AS created_time 
	FROM agentList 
	JOIN(SELECT rv_id, r_username, agentList_ra_regno, rating, content, review.created_time AS created_time 
	FROM resident 
	JOIN review 
	ON r_id=resident_r_id) A 
	ON agentList_ra_regno=ra_regno WHERE ra_regno=?`;
    let res = await db.query(rawQuery, [params.ra_regno]);
    result(res[0]);
  },
  updateBookmark: async (id, body, result) => {
    let rawQuery = ``;
    console.log(body);
    if (body.isBookmark === "true") {
      rawQuery = `DELETE FROM bookmark WHERE resident_r_id=? AND agentList_ra_regno=?`;
    } else {
      rawQuery = `INSERT INTO bookmark (resident_r_id, agentList_ra_regno) values (?, ?)`;
    }
    try {
      const res = await db.query(rawQuery, [id, body.raRegno]);
      result(res);
    } catch (error) {
      result(null, res);
    }
  },
};
