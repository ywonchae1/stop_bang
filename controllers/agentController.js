//html 템플릿
const template = require('../views/template.js');

//Models
const agentModel = require('../models/agentModel.js');

module.exports = {
	mainPage: (req, res) => {
		agentModel.getReviewByRaRegno(req.params, (agentReviews) => {
			console.log(agentReviews);
			cmpName = agentReviews[0].cmp_nm;
			raRegno = agentReviews[0].ra_regno;
			res.render('agent/agentIndex.ejs', {title: `${cmpName}의 후기`, reviewData: agentReviews, direction: `/review/${cmpName}/create`, raRegno: raRegno});
		});
	}
};
