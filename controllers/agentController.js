//db정보받기
const db = require('../config/db.js');

//html 템플릿
const template = require('../views/template.js');

exports.mainPage = (req, res) => {
	let rawQuery = `SELECT rv_id, rating, content, cmp_nm, ra_regno FROM review JOIN agentList ON agentList_ra_regno=ra_regno WHERE cmp_nm=?`;
	let cmpName = req.params.cmp_nm;
	db.dbInfo.query(rawQuery, [cmpName], (err, agentReviews) => {
		let raRegno = agentReviews[0].ra_regno;
		let reviewList = template.listHTML(agentReviews);
		let html = template.reviewHTML(`${cmpName}의 후기`, reviewList, `
			<form action='/review/${cmpName}/create' method='post'>
				<input type='hidden' name='raRegno' value="${raRegno}">
				<p><input type='submit' value='후기 작성하고 휴지 받기'></p>
			</form>`);

		res.send(html);
	});
};
