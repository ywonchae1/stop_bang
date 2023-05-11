//html 템플릿
const template = require('../views/template.js');

//Models
const agentModel = require('../models/agentModel.js');

module.exports = {
	mainPage: (req, res) => {
		agentModel.getReviewByRaRegno(req.params, (agentReviews) => {
			cmpName = agentReviews[0].cmp_nm;
			raRegno = agentReviews[0].ra_regno;
			let html = template.reviewHTML(`${cmpName}의 후기`, reviewList, `
			<form action='/review/${cmpName}/create' method='post'>
				<input type='hidden' name='raRegno' value="${raRegno}">
				<p><input type='submit' value='후기 작성하고 휴지 받기'></p>
			</form>`);

			res.send(html);
		});
	}
};
