//db정보받기
const db = require('../config/db.js');

module.exports = {
	getReviewByRaRegno: async (params, result) => {
		let rawQuery = `SELECT rv_id, rating, content, cmp_nm, ra_regno FROM review JOIN agentList ON agentList_ra_regno=ra_regno WHERE cmp_nm=?`;
		console.log(db);
		let res = await db.query(rawQuery, [params.cmp_nm]);
		result(res);
	}
};
