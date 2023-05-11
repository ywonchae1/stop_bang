const residentModel = require("../models/residentModel");
const sql = require("../config/db");

module.exports = {
  myReview: (req, res, next) => {
    residentModel.getReviewById(2, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.reviews = result[0];
        next();
      }
    });
  },
  myReviewView: (req, res) => {
    res.render("resident/myReview"); //나중에 경로 바꾸거나 할것(파일이름이랑 다르게하고싶음)
  },
  openReview: (req, res, next) => {
    residentModel.getOpenedReviewById(2, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.openReviews = result[0];
        next();
      }
    });
  },
  openReviewView: (req, res) => {
    res.render("resident/openReview");
  },
  bookmark: (req, res, next) => {
    residentModel.getBookMarkById(2, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.bookmarks = result[0];
        next();
      }
    });
  },
  bookmarkView: (req, res) => {
    res.render("resident/bookmark");
  },
  deleteBookmark: (req, res) => {
    res.locals.redirect = "/resident/bookmark";
    next();
  },
  settings: (req, res, next) => {
    residentModel.getResidentById(2, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.resident = result[0][0];
        next();
      }
    });
  },
  settingsView: (req, res) => {
    res.render("resident/settings");
  },
  editSettings: (req, res, next) => {
    next();
  },
  updateSettings: (req, res, next) => {
    res.locals.redirect = "/resident/settings";
    next();
  },
  // editPassword: (req, res, next) => {
  //   next();
  // },
  // updatePassword: (req, res, next) => {
  //   res.locals.redirect = "/user/settings";
  //   res.locals.subscriber = subscriber;
  //   next();
  // },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
};
