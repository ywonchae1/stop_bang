const residentModel = require("../models/residentModel");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");

module.exports = {
  myReview: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      )
      let r_username = decoded.userId;
      if (r_username == null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        residentModel.getReviewById(r_username, (result, err) => {
          if (result === null) {
            console.log("error occured: ", err);
          } else {
            res.locals.reviews = result[0];
            res.locals.tagsData = tags;
            next();
          }
        });
      }
    }
  },
  myReviewView: (req, res) => {
    res.render("resident/myReview", { path: "myreview" });
  },
  openReview: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let r_username = decoded.userId;
      if (r_username == null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        residentModel.getOpenedReviewById(r_username, (result, err) => {
          if (result === null) {
            console.log("error occured: ", err);
          } else {
            res.locals.openReviews = result[0];
            res.locals.tagsData = tags;
            next();
          }
        });
      }
    }
  },
  openReviewView: (req, res) => {
    res.render("resident/openReview", { path: "openreview" });
  },
  bookmark: (req, res, next) => {
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let r_username = decoded.userId;
      residentModel.getBookMarkById(r_username, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.bookmarks = result[0];
          next();
        }
      });
    }
  },
  bookmarkView: (req, res) => {
    res.render("resident/bookmark", { path: "bookmark" });
  },
  deleteBookmark: (req, res, next) => {
    residentModel.deleteBookMarkById(req.params.id, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.locals.redirect = "/resident/bookmark";
        next();
      }
    });
  },
  settings: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let r_username = decoded.userId;
      if (r_username == null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        residentModel.getResidentById(r_username, (result, err) => {
          if (result === null) {
            console.log("error occured: ", err);
          } else {
            res.locals.resident = result[0][0];
            next();
          }
        });
      }
  }
  },
  settingsView: (req, res) => {
    res.render("resident/settings", { path: "settings" });
  },
  editSettings: (req, res, next) => {
    next();
  },
  updateSettings: (req, res, next) => {
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let r_username = decoded.userId;
      const body = req.body;
      if (r_username === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        if (body.birth === "") body.birth = null;
        residentModel.updateResident(r_username, body, (result, err) => {
          if (result === null) {
            console.log("error occured: ", err);
          } else {
            res.locals.redirect = "/resident/settings";
            next();
          }
        });
      }
    }
  },
  updatePassword: (req, res, next) => {
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      const r_username = decoded.userId;
      if (r_username === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        residentModel.updateResidentPassword(r_username, req.body, (result, err) => {
          if (result === null) {
            if (err === "pwerror") {
              // res.locals.pwerr = "pwerror";
              res.locals.redirect = "/resident/settings";
              next();
            }
          } else {
            res.locals.redirect = "/resident/settings";
            next();
          }
        });
      }
    }
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
};
