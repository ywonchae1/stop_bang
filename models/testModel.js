//db정보받기
const db = require('../config/db.js');

module.exports = {
	test: async (params, result) => {
		let rawQuery = `SELECT CURRENT_TIMESTAMP();`;
		let res = await db.query(rawQuery);
		result(res[0]);
	}
};
