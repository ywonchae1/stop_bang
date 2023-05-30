//db정보받기
const db = require("../config/db.js");

module.exports = {
    getRealtorProfile: async (ra_regno) => {
		try {
			const res = await db.query(`
			SELECT agentList.rdealer_nm, agentList.cmp_nm, agentList.address, agent.a_profile_image
			FROM agentList
			LEFT JOIN agent ON agentList.ra_regno = agent.agentList_ra_regno
			WHERE agentList.ra_regno = ?;`,
			[ra_regno]
			);
			return res[0];
		} catch (error) {
			return error;
		}
    },

    getMainInfo: async (ra_regno) => {
		let rawQuery = `
		SELECT ra_regno, a_image1, a_image2, a_image3, a_introduction
		FROM agent
		RIGHT OUTER JOIN agentList
		ON agentList_ra_regno=ra_regno
		WHERE ra_regno = ?;`;
		let res = await db.query(rawQuery, [ra_regno]);
		return res[0][0];
    },

    getEnteredAgent: async (ra_regno) => {
		try {
			const res = await db.query(`
			SELECT a_office_hours, contact_number, telno, ra_regno
			FROM agent_contact
			RIGHT OUTER JOIN agentList
			ON agent_contact.agent_agentList_ra_regno = agentList.ra_regno
			LEFT OUTER JOIN agent
			ON agentList.ra_regno = agent.agentList_ra_regno
			WHERE ra_regno = ?;`,
			[ra_regno]
			);
			return res
		} catch (error) {
			return error
		}
	},
	
	getBookmarkByIdnRegno: async (ra_regno, r_id) => {
		try {
			const res = await db.query(`SELECT * FROM bookmark WHERE agentList_ra_regno=? AND resident_r_id=?`, [ra_regno, r_id]);
			return res;
		} catch (error) {
			return error
		}
	},

    getReviewByRaRegno: async (ra_regno, r_id) => {
		try {
			let rawQuery = `
			SELECT cmp_nm, ra_regno, rv_id, r_id, r_username, rating, content, tags, DATE_FORMAT(newTable.created_time,'%Y-%m-%d') AS created_time
			FROM agentList
			JOIN(
			SELECT rv_id, r_id, r_username, agentList_ra_regno, rating, tags, content, review.created_time AS created_time
			FROM resident
			JOIN review
			ON r_id=resident_r_id
			) newTable
			ON agentList_ra_regno=ra_regno
			WHERE ra_regno=?;`;

			let checkOpenedRawQuery = `
			SELECT review_rv_id
			FROM opened_review
			WHERE resident_r_id=?`;

			let checkRPointRawQuery = `
			SELECT r_point
			FROM resident
			WHERE r_id=?`;

			let reviews = await db.query(rawQuery, [ra_regno]);
			let opened = await db.query(checkOpenedRawQuery, [r_id]);
			let rPoint = await db.query(checkRPointRawQuery, [r_id]);
			let canOpen = 1;
			if(rPoint[0][0].r_point < 2) canOpen = 0;
			return ({reviews: reviews[0], opened: opened[0], canOpen: canOpen});
		} catch(err) {
			return err
		}
    },

    getRating: async (params) => {
		let rawQuery = `
		SELECT TRUNCATE(AVG(rating), 1) AS agentRating
		FROM review
		RIGHT OUTER JOIN agentList
		ON agentList_ra_regno=ra_regno
		WHERE ra_regno=?;`;
		let res = await db.query(rawQuery, [params.ra_regno]);
		return res[0][0].agentRating;
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
    },

    updateBookmark: async (id, body, result) => {
		let rawQuery = ``;
		let res;
		
		try {
			if (body.bookmark !== '0') {
				console.log("here")
				rawQuery = `DELETE FROM bookmark WHERE bm_id=?`;
				res = await db.query(rawQuery, [body.bookmark]);
			} else {
				rawQuery = `INSERT INTO bookmark (resident_r_id, agentList_ra_regno) values (?, ?)`;
				 res = await db.query(rawQuery, [body.id, body.raRegno]);
			}
			result(res);
		} catch (error) {
			result(null, error);
		}
    }
};