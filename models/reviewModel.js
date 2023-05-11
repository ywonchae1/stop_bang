//db정보받기
const db = require('../config/db.js');

model.exports = {
	updateReview: async (params, body, result) => {
		let cmpName = params.cmp_nm;
		let raRegno = body.raRegno;
		let rate = body.rate;
		let description = body.description;
		let rawQuery = `INSERT INTO review(resident_r_id, agentList_ra_regno, rating, content) VALUES(3, ?, ?, ?)`;
		let res = await db.query(rawQuery, [raRegno, rate, description]);
		result(res);
	}
};
