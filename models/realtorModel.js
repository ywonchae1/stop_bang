//db정보받기
const db = require('../config/db.js');

module.exports = {
    getReviewByRaRegno: async (params, r_id, result) => {
	let rawQuery=`
	SELECT rv_id, r_id, r_username, A.rating AS rating, content, cmp_nm, ra_regno, DATE_FORMAT(A.created_time,'%Y-%m-%d') AS created_time 
	FROM agentList 
	LEFT JOIN(SELECT rv_id, r_id, r_username, agentList_ra_regno, rating, content, review.created_time AS created_time 
	FROM resident 
	JOIN review 
	ON r_id=resident_r_id) A 
	ON agentList_ra_regno=ra_regno WHERE ra_regno=?`;

	let checkOpenedRawQuery = `
	SELECT review_rv_id
	FROM opened_review
	WHERE resident_r_id=?`;
	
	let checkRPointRawQuery = `
	SELECT r_point
	FROM resident
	WHERE r_id=?`;

	let reviews = await db.query(rawQuery, [params.ra_regno]);
	let opened = await db.query(checkOpenedRawQuery, [r_id]);
	let rPoint = await db.query(checkRPointRawQuery, [r_id]);
	let canOpen = true;
	if(rPoint[0][0].r_point < 2) canOpen = false;
	result(reviews[0], opened[0], canOpen);
    },

    getRating: async (params, result) => {
	let rawQuery = `
	SELECT ROUND(AVG(rating), 1) AS agentRating
	FROM review
	WHERE agentList_ra_regno=?`
	let res = await db.query(rawQuery, [params.ra_regno]);
	result(res[0][0]);
    },

    insertOpenedReview: async (r_id, rv_id, result) => {
	let insertRawQuery = `
	INSERT
	INTO opened_review(resident_r_id, review_rv_id)
	VALUE(?, ?);
	`
	let usePointRawQuery = `
	UPDATE resident
	SET r_point=r_point - 2
	WHERE r_id=?;
	`
	await db.query(insertRawQuery, [r_id, rv_id]);
	await db.query(usePointRawQuery, [r_id]);
	result();
    }
};
