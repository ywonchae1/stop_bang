//Models
const reviewModel = require("../models/reviewModel.js");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");

module.exports = {
  //후기 추가
  createReview: (req, res) => {
    reviewModel.getRealtorByRaRegno(req.params, (result) => {
      res.render("review/writeReview.ejs", {
        realtor: result,
        tagsdata: tags.tags,
      });
    });
  },

  //후기 추가 DB 반영
  creatingReview: (req, res) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) return res.send("로그인 필요합니다");
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let r_id = decoded.userId;
    if (r_id === null) res.send("로그인이 필요합니다.");
    reviewModel.createReviewProcess(r_id, req.params, req.body, () => {
      res.redirect(`/realtor/${req.params.ra_regno}`);
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
      let updatedTime = residentReview.check_point;
      let checkedTags = residentReview.tags;

      let title = `${cmpName} - ${userName}님의 후기 수정하기`;
      res.render("review/updateReview.ejs", {
        title: title,
        reviewId: req.params.rv_id,
        raRegno: raRegno,
        rate: rate,
        description: description,
        userName: userName,
        updatedTime: updatedTime,
        checkedTags: checkedTags,
        tagsdata: tags.tags,
      });
    });
  },

  //후기 수정 DB 반영
  updatingReview: (req, res) => {
	  reviewModel.updateReviewProcess(req.params, req.body, () => {
	    res.redirect(`/resident/myReview`);
	  });
  }
};
