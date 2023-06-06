//Models
const agentModel = require("../models/agentModel.js");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");
//multer
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Init Upload
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

const makeStatistics = (reviews) => {
  let array = Array.from({ length: 10 }, () => 0);
  let stArray = new Array(10);
  reviews.forEach((review) => {
    review.tags.split("").forEach((tag) => {
      array[parseInt(tag)]++;
    });
  });
  for (let index = 0; index < array.length; index++) {
    stArray[index] = { id: index, tag: tags.tags[index], count: array[index] };
  }
  stArray.sort((a, b) => {
    return b.count - a.count;
  });
  return stArray;
};

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = {
  upload: multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }),

  //후기 신고
	reporting: async (req, res) => {
		//쿠키로부터 로그인 계정 알아오기
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let a_id = decoded.userId;
      if(a_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      ra_regno = await agentModel.reportProcess(req, a_id);
      console.log("신고완료");
      res.redirect(`${req.baseUrl}/${ra_regno[0][0].agentList_ra_regno}`);
    }
	},

  agentProfile: async (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      try {
        let agent = await agentModel.getAgentProfile(req.params.id);
        let getMainInfo = await agentModel.getMainInfo(req.params.id);
        //다른 공인중개사 페이지 접근 제한(수정제한으로 수정 필요할지도)
        if (getMainInfo.a_username !== decoded.userId)
          res.render('notFound.ejs', {message: "접근이 제한되었습니다. 공인중개사 계정으로 로그인하세요"});
        let getEnteredAgent = await agentModel.getEnteredAgent(req.params.id);
        let getReviews = await agentModel.getReviewByRaRegno(req.params.id);
        let getReport = await agentModel.getReport(req.params.id, decoded.userId);
        let getRating = await agentModel.getRating(req.params.id);
        let statistics = makeStatistics(getReviews);
        res.locals.agent = agent[0];
        res.locals.agentMainInfo = getMainInfo;
        res.locals.agentSubInfo = getEnteredAgent[0][0];
        res.locals.agentReviewData = getReviews;
        res.locals.report = getReport;
        res.locals.statistics = statistics;

        if (getRating === null) {
          res.locals.agentRating = 0;
          res.locals.tagsData = null;
        } else {
          res.locals.agentRating = getRating;
          res.locals.tagsData = tags.tags;
        }
      } catch (err) {
        console.error(err.stack);
      }
      next();
    }
  },

  agentProfileView: (req, res) => {
    res.render("agent/agentIndex");
  },

  updateMainInfo: async (req, res) => {
    let getMainInfo = await agentModel.getMainInfo(req.params.id);

    let image1 = getMainInfo.a_image1;
    let image2 = getMainInfo.a_image2;
    let image3 = getMainInfo.a_image3;
    let introduction = getMainInfo.a_introduction;

    //여기가 문제같음...........내일 가서 model쪽이랑 여기 물어보자

      let title = `소개글 수정하기`;
      res.render("agent/updateMainInfo.ejs", {
        title: title,
        agentId: req.params.id,
        image1: image1,
        image2: image2,
        image3: image3,
        introduction: introduction,
      });
  },

  updatingMainInfo: (req, res, next) => {
    agentModel.updateMainInfo(req.params.id, req.files, req.body, () => {
      if (res === null) {
        if (error === "imageError") {
          res.render('notFound.ejs', {message: "이미지 크기가 너무 큽니다. 다른 사이즈로 시도해주세요."})
        }
      } else {
        res.locals.redirect = `/agent/${req.params.id}`;
        next();
      }
    });
  },

  updateEnteredInfo: async (req, res) => {
    let getEnteredAgent = await agentModel.getEnteredAgent(req.params.id);

    let profileImage = getEnteredAgent[0][0].a_profile_image;
    let officeHour = getEnteredAgent[0][0].a_office_hours;

    let title = `부동산 정보 수정하기`;
    res.render("agent/updateAgentInfo.ejs", {
      title: title,
      agentId: req.params.id,
      profileImage: profileImage,
      officeHour: officeHour,
    });
  },

  updatingEnteredInfo: (req, res, next) => {
    agentModel.updateEnterdAgentInfo(req.params.id, req.file, req.body, () => {
      console.log(req.params.id);
      res.locals.redirect = `/agent/${req.params.id}`;
      next();
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
      agentModel.getAgentById(decoded, (result, err) => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.locals.agent = result[0][0];
          next();
        }
      });
    }
  },

  settingsView: (req, res) => {
    res.render("agent/settings", { path: "settings" });
  },

  updateSettings: (req, res, next) => {
    if (req.cookies.authToken == undefined) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    else {
      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET_KEY
      );
      let a_id = decoded.userId;
      const body = req.body;
      if (a_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        agentModel.updateAgent(a_id, body, (result, err) => {
          if (result === null) {
            console.log("error occured: ", err);
          } else {
            res.locals.redirect = "/agent/settings";
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
      const a_id = decoded.userId;
      if (a_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
      else {
        agentModel.updateAgentPassword(a_id, req.body, (result, err) => {
          if (result === null) {
            if (err === "pwerror") {
              res.render('notFound.ejs', { message: "입력한 비밀번호가 잘못되었습니다." });
            }
          } else {
            res.locals.redirect = "/agent/settings";
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
