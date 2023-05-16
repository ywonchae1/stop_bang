//Models
const realtorModel = require('../models/realtorModel.js');

module.exports = {
	mainPage: (req, res) => {
		realtorModel.getReviewByRaRegno(req.params, (agentReviews) => {
			console.log(agentReviews);
			cmpName = agentReviews[0].cmp_nm;
			raRegno = agentReviews[0].ra_regno;
			res.render('realtor/realtorIndex.ejs', {title: `${cmpName}의 후기`, agentReviewData: agentReviews, direction: `/review/${cmpName}/create`, raRegno: raRegno});
		});
	}
};
