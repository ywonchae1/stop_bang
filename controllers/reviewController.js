//Models
const reviewModel = require('../models/reviewModel.js');

module.exports = {
	//후기 추가
	createReview: (req, res) => {
		let title = `${req.params.cmp_nm} 후기 작성하기`
		res.render('review/writeReview.ejs', 
		{
			title: title, 
			raRegno: req.body.raRegno, 
			cmpName: req.params.cmp_nm
		});
	},

	//후기 추가 DB 반영
	creatingReview: (req, res) => {
		console.log(req.body);
		reviewModel.createReviewProcess(req.params, req.body, () => {
			res.redirect(`/agent/${req.params.cmp_nm}`);
		});
	},

	//후기 수정
	updateReview: (req, res) => {
		reviewModel.getReviewByRvId(req.params, (residentReview) => {
			let cmpName = residentReview.cmp_nm;
			let userName = residentReview.r_username;
			let raRegno = residentReview.ra_regno;
			let rate = residentReview.rating;
			let description = residentReview.content;

			let title = `${cmpName} - ${userName}님의 후기 수정하기`
			res.render('review/updateReview.ejs', 
			{
				title: title, 
				reviewId: req.params.rv_id, 
				raRegno: raRegno, 
				rate: rate, 
				description: description, 
				userName: userName
			});
		});
	},

	//후기 수정 DB 반영
	updatingReview: (req, res) => {
		reviewModel.updateReviewProcess(req.params, req.body, () => {
			res.redirect(`/resident/myReview`);
			//res.redirect(`/resident/${req.body.userName}/myReviews`);
		});
	}
};
