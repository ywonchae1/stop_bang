//db정보받기
const db = require('../config/db.js');

module.exports = {
	createReviewProcess: async (params, body, result) => {
		let cmpName = params.cmp_nm;
		let raRegno = body.raRegno;
		let rate = body.rate;
		let description = body.description;
		let rawQuery = `INSERT INTO review(resident_r_id, agentList_ra_regno, rating, content) VALUES(?, ?, ?, ?)`;
		await db.query(rawQuery, [1, raRegno, rate, description]);
		result();
	},

	getReviewByRvId: async (params, result) => {
		let reviewId = params.rv_id;
		let rawQuery = `
		SELECT rv_id, resident_r_id, r_username, cmp_nm, rating, content
		FROM resident
		JOIN (SELECT rv_id, resident_r_id, cmp_nm, rating, content
					FROM review
					JOIN agentList
					ON agentList_ra_regno=ra_regno) newTable
		ON resident.r_id=newTable.resident_r_id
		WHERE newTable.rv_id=?` 
		let res = await db.query(rawQuery, [reviewId]);
		result(res[0]);
	},

	updateReviewProcess: async (params, body, result) => {
		let rawQuery = `UPDATE review SET rating=?, content=? WHERE rv_id=?`;
		let res = await db.query(rawQuery, [body.rate, body.description, params.rv_id]);
		result(res);
	}
};
