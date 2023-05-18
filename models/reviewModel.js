//db정보받기
const db = require('../config/db.js');

module.exports = {
    //부동산 조회
    getRealtorByRaRegno: async (params, result) => {
	let raRegno = params.ra_regno;
	let rawQuery = `
	    SELECT ra_regno, cmp_nm
	    FROM agentList
	    WHERE ra_regno=?
	    `
	let res = await db.query(rawQuery, [raRegno]);
	result(res[0][0]);
    },

    createReviewProcess: async (r_id, params, body, result) => {
	let raRegno = params.ra_regno;
	let rate = body.rate;
	let description = body.description;
	let createReviewRawQuery = `
		INSERT 
		INTO review(resident_r_id, agentList_ra_regno, rating, content) 
		VALUES(?, ?, ?, ?)`;
	let pointRawQuery = `
	    UPDATE resident
	    SET r_point = CASE WHEN (SELECT COUNT(*) FROM review WHERE agentList_ra_regno=?)=0 THEN r_point+3 ELSE r_point+1 END
	    WHERE r_id = ?;
	    `;
	await db.query(createReviewRawQuery, [r_id, raRegno, rate, description]);
	await db.query(pointRawQuery, [raRegno, r_id]);
	result();
    },

    getReviewByRvId: async (params, result) => {
	let reviewId = params.rv_id;
	let rawQuery = `
		SELECT rv_id, resident_r_id, r_username, cmp_nm, ra_regno, rating, content
		FROM resident
		JOIN (SELECT rv_id, resident_r_id, cmp_nm, ra_regno, rating, content
			FROM review
			JOIN agentList
			ON agentList_ra_regno=ra_regno) newTable
		ON resident.r_id=newTable.resident_r_id
		WHERE newTable.rv_id=?` 
	let res = await db.query(rawQuery, [reviewId]);
	result(res[0][0]);
    },

    updateReviewProcess: async (params, body, result) => {
	let rawQuery = `
		UPDATE review 
		SET rating=?, content=? WHERE rv_id=?`;
	let res = await db.query(rawQuery, [body.rate, body.description, params.rv_id]);
	result(res);
    }
};
