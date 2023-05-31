//Models
const realtorModel = require("../models/realtorModel.js");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");

module.exports = {
  mainPage: async (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let r_id = decoded.userId;
    if (r_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    res.locals.r_id = r_id;
    try {
      let agent = await realtorModel.getRealtorProfile(req.params.ra_regno);
      let agentMainInfo = await realtorModel.getMainInfo(req.params.ra_regno);
      let agentSubInfo = await realtorModel.getEnteredAgent(req.params.ra_regno);
      let getReviews = await realtorModel.getReviewByRaRegno(req.params.ra_regno, r_id);
      let getReport = await realtorModel.getReport(req.params, r_id);
      let getRating = await realtorModel.getRating(req.params);
      res.locals.agent = agent[0];
      res.locals.agentMainInfo = agentMainInfo;
      res.locals.agentSubInfo = agentSubInfo[0][0];
      res.locals.agentReviewData = getReviews.reviews;
      res.locals.openedReviewData = getReviews.opened;
      res.locals.canOpen = getReviews.canOpen;
      res.locals.title = `${res.locals.agent.cmp_nm}의 후기`;
      res.locals.direction = `/review/${req.params.ra_regno}/create`;
      res.locals.cmpName = res.locals.agent.cmp_nm;
      res.locals.report = getReport;
      
      if (getRating === null) {
        res.locals.rating = 0;
        res.locals.tagsData = null;
      } else {
        res.locals.rating = getRating;
        res.locals.tagsData = tags.tags;
      }
    } catch (err) {
        console.error(err.stack)
    }
    next();
  },
  realtorView: (req, res) => {
	  res.render('realtor/realtorIndex.ejs');
  },

  opening: async (req, res) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let r_id = decoded.userId;
    if (r_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    let rv_id = req.params.rv_id;
    await realtorModel.insertOpenedReview(r_id, rv_id, () => {
      res.redirect(`/realtor/${req.params.ra_regno}`);
    });
  },

  //후기 신고
	reporting: async (req, res) => {
		//쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let r_id = decoded.userId;
		if(r_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
		ra_regno = await reviewModel.reportProcess(req, r_id);
		console.log("신고완료");
	  res.redirect(`${req.baseUrl}/${ra_regno[0][0].agentList_ra_regno}`);
	},

  updateBookmark: (req, res) => {
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    const r_id = decoded.userId;
    if (r_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      let body = {
        raRegno: req.params.ra_regno,
        isBookmark: req.body.bookmarkData,
      };
      realtorModel.updateBookmark(r_id, body, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.redirect(`/realtor/${req.params.ra_regno}`);
        }
      });
    }
  }
};
