//db정보받기
const db = require('../config/db.js');

module.exports = {
    getReviewByRaRegno: async (params, result) => {
	let rawQuery=`
	SELECT rv_id, r_id, r_username, A.rating AS rating, content, cmp_nm, ra_regno, DATE_FORMAT(A.created_time,'%Y-%m-%d') AS created_time 
	FROM agentList 
	JOIN(SELECT rv_id, r_id, r_username, agentList_ra_regno, rating, content, review.created_time AS created_time 
	FROM resident 
	JOIN review 
	ON r_id=resident_r_id) A 
	ON agentList_ra_regno=ra_regno WHERE ra_regno=?`;
	let res = await db.query(rawQuery, [params.ra_regno]);
	result(res[0]);
    },

    getRating: async (params, result) => {
	let rawQuery = `
	SELECT ROUND(AVG(rating), 1) AS agentRating
	FROM review
	WHERE agentList_ra_regno=?`
	let res = await db.query(rawQuery, [params.ra_regno]);
	result(res[0][0]);
    }
};
