// model.js
const db = require("../config/db");

exports.getAgenciesModel = async (sgg_nm, bjdong_nm) => {
    //console.log(`MODEL get agencies // sgg_nm: ${sgg_nm}, bjdong_nm: ${bjdong_nm}`);

    try {
	const query = `
	SELECT *
	FROM agentList
	LEFT JOIN (
	SELECT agentList_ra_regno, TRUNCATE(AVG(rating), 1) AS agentRating
	FROM review
	GROUP BY agentList_ra_regno
	) newTable
	ON ra_regno=agentList_ra_regno
	WHERE sgg_nm = ? AND bjdong_nm = ?`;
	const [rows, fields] = await db.query(query, [sgg_nm, bjdong_nm]);
	console.log("agentList info ", rows);
	return rows;
    } catch (err) {
	console.error(err.stack);
	throw err;
    }
};

// 중개업소 정보 조회 API
exports.getOneAgencyModel = async (sgg_nm, bjdong_nm, cmp_nm) => {
    try {
	const query = `SELECT * FROM agentList WHERE sgg_nm = ? AND bjdong_nm = ? AND cmp_nm LIKE ?`;
	const [rows, fields] = await db.query(query, [sgg_nm, bjdong_nm, cmp_nm]);
	console.log("An agency info : ", rows);
	return rows;
    } catch (err) {
	console.error(err.stack);
    }
};
