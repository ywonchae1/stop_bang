//Models
const realtorModel = require('../models/realtorModel.js');

module.exports = {
    mainPage: async (req, res, next) => {
	//쿠키로부터 로그인 계정 알아오기
	let r_id = req.cookies.authToken;
	if(r_id === null) res.send('로그인이 필요합니다.');
	res.locals.r_id = r_id;
	await realtorModel.getReviewByRaRegno(req.params, (agentReviews, err) => {
	    if (agentReviews[0] === null) {
		console.log("error occured: ", err);
	    } else {
		res.locals.agentReviewData = agentReviews;
		res.locals.title = `${agentReviews[0].cmp_nm}의 후기`;
		res.locals.direction = `/review/${req.params.ra_regno}/create`; 
		res.locals.cmpName = agentReviews[0].cmp_nm;
	    }
	});
	await realtorModel.getRating(req.params, (agentRating, err) => {
	    if (agentRating[0] === null) {
		console.log("error occured: ", err);
	    } else {
		res.locals.rating = agentRating;
	    }
	});
	next();
    },
    realtorView: (req, res) => {
	res.render('realtor/realtorIndex.ejs');
    }
};
