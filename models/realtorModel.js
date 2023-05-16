//db정보받기
const db = require('../config/db.js');

module.exports = {
	getReviewByRaRegno: async (params, result) => {
		let rawQuery = `
		SELECT rv_id, r_username, rating, content, cmp_nm, ra_regno
		FROM agentList
		JOIN (SELECT rv_id, r_username, agentList_ra_regno, rating, content
					FROM resident
					JOIN review
					ON r_id=resident_r_id) A
		ON agentList_ra_regno=ra_regno WHERE cmp_nm=?;`;
		let res = await db.query(rawQuery, [params.cmp_nm]);
		result(res[0]);
	}
};
