//Models
const realtorModel = require("../models/realtorModel.js");
const tags = require("../public/assets/tag.js");

module.exports = {
  mainPage: (req, res) => {
    realtorModel.getReviewByRaRegno(req.params, (agentReviews) => {
      cmpName = agentReviews[0].cmp_nm;
      raRegno = agentReviews[0].ra_regno;
      res.render("realtor/realtorIndex.ejs", {
        title: `${cmpName}의 후기`,
        agentReviewData: agentReviews,
        direction: `/review/${raRegno}/create`,
        raRegno: raRegno,
        isBookmark: true,
        tagsData: tags.tags,
      });
    });
  },
  updateBookmark: (req, res) => {
    const r_id = req.cookies.authToken;
    if (r_id === null) res.send("로그인이 필요합니다.");
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
  },
};
