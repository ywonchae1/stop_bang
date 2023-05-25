const residentModel = require("../models/residentModel");

module.exports = {
  myReview: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    let r_id = req.cookies.authToken;
    if (r_id == null) res.send("로그인이 필요합니다.");
    else {
      residentModel.getReviewById(r_id, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.reviews = result[0];
          next();
        }
      });
    }
  },
  myReviewView: (req, res) => {
    res.render("resident/myReview", { path: "myreview" });
  },
  openReview: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    let r_id = req.cookies.authToken;
    if (r_id == null) res.send("로그인이 필요합니다.");
    else {
      residentModel.getOpenedReviewById(r_id, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.openReviews = result[0];
          next();
        }
      });
    }
  },
  openReviewView: (req, res) => {
    res.render("resident/openReview", { path: "openreview" });
  },
  bookmark: (req, res, next) => {
    let r_id = req.cookies.authToken;
    residentModel.getBookMarkById(r_id, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.locals.bookmarks = result[0];
        next();
      }
    });
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
    let r_id = req.cookies.authToken;
    if (r_id == null) res.send("로그인이 필요합니다.");
    else {
      residentModel.getResidentById(r_id, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.resident = result[0][0];
          next();
        }
      });
    }
  },
  settingsView: (req, res) => {
    res.render("resident/settings", { path: "settings" });
  },
  editSettings: (req, res, next) => {
    next();
  },
  updateSettings: (req, res, next) => {
    let r_id = req.cookies.authToken;
    const body = req.body;
    if (r_id === null) res.send("로그인이 필요합니다.");
    else {
      if (body.birth === "") body.birth = null;
      residentModel.updateResident(r_id, body, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.redirect = "/resident/settings";
          next();
        }
      });
    }
  },
  updatePassword: (req, res, next) => {
    const r_id = req.cookies.authToken;
    if (r_id === null) res.send("로그인이 필요합니다.");
    else {
      residentModel.updateResidentPassword(r_id, req.body, (result, err) => {
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
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
};
