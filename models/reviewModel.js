//db정보받기
const passport = require('passport');
const db = require('../config/db.js');

module.exports = {
    //부동산 조회
    getRealtorByRaRegno: async (params, result) => {
		let raRegno = params.ra_regno;
		let rawQuery = `
			SELECT ra_regno, cmp_nm
			FROM agentList
			WHERE ra_regno=?`;
		let res = await db.query(rawQuery, [raRegno]);
		result(res[0][0]);
    },

  	createReviewProcess: async (r_username, params, body, result) => {
		let raRegno = params.ra_regno;
		let rate = body.rate;
		let description = body.description;
		let tags = Array.isArray(body.tag) ? body.tag.join("") : body.tag;

		let findRId = `
		SELECT r_id
		FROM resident
		WHERE r_username=?;`;

		let createReviewRawQuery = `
			INSERT 
			INTO review(resident_r_id, agentList_ra_regno, rating, content, tags) 
			VALUES(?, ?, ?, ?, ?)`;
		let pointRawQuery = `
			UPDATE resident
			SET r_point =
			CASE
			WHEN (
				SELECT COUNT(*)
				FROM review
				RIGHT OUTER JOIN agentList
				ON agentList_ra_regno=ra_regno
				WHERE ra_regno=?
				)=1
			THEN r_point+5
			ELSE r_point+3
			END
			WHERE r_username=?;
			`;
		
		found = await db.query(findRId, [r_username]);
		await db.query(createReviewRawQuery, [
		found[0][0].r_id,
		raRegno,
		rate,
		description,
		tags,
		]);
		await db.query(pointRawQuery, [raRegno, r_username]);
		result();
	},

    getReviewByRvId: async (params, result) => {
		let reviewId = params.rv_id;
		let rawQuery = `
			SELECT rv_id, resident_r_id, r_username, cmp_nm, ra_regno, newTable.rating AS rating, content, tags, CONCAT(CURDATE(), "수정됨") AS check_point
			FROM resident
			JOIN (SELECT rv_id, resident_r_id, cmp_nm, ra_regno, rating, tags, content
				FROM review
				JOIN agentList
				ON agentList_ra_regno=ra_regno) newTable
			ON resident.r_id=newTable.resident_r_id
			WHERE newTable.rv_id=?`;
		let res = await db.query(rawQuery, [reviewId]);
		result(res[0][0]);
	},

	updateReviewProcess: async (params, body, result) => {
		let desc = body.originDesc;
		if(body.description !== "")
			desc = body.originDesc + "\n" + body.updatedTime + "\n" + body.description;
		
		let tags = body.checkedTags;
		if(body.tag !== undefined) {
			tags += Array.isArray(body.tag)
				? body.tag.join("")
				: body.tag;
		}
		let rawQuery = `
			UPDATE review
			SET rating=?, content=?, tags=? WHERE rv_id=?`;
		let res = await db.query(rawQuery, [body.rate, desc, tags, params.rv_id]);
		result();
    },
};
