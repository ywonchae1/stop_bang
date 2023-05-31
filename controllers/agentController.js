//Models
const agentModel = require("../models/agentModel.js");
const jwt = require("jsonwebtoken");
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
  },
});

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

  agentProfile: async (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) return res.send("로그인 필요합니다");
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    try {
      let agent = await agentModel.getAgentProfile(req.params.id);
      let getMainInfo = await agentModel.getMainInfo(req.params.id);
      //다른 공인중개사 페이지 접근 제한(수정제한으로 수정 필요할지도)
      if (getMainInfo.a_id !== decoded.userId)
        return res.send(
          "접근이 제한되었습니다. 공인중개사 계정으로 로그인하세요"
        );
      let getEnteredAgent = await agentModel.getEnteredAgent(req.params.id);
      let getReviews = await agentModel.getReviewByRaRegno(req.params.id);
      let getRating = await agentModel.getRating(req.params.id);
      let getReport = await agentModel.getReport(req.params.id, decoded.userId);
      res.locals.agent = agent[0];
      res.locals.agentMainInfo = getMainInfo;
      res.locals.agentSubInfo = getEnteredAgent[0][0];
      res.locals.agentReviewData = getReviews;
      res.locals.report = getReport;

      if (getRating === null) {
        res.locals.agentRating = 0;
      } else {
        res.locals.agentRating = getRating;
      }
    } catch (err) {
      console.error(err.stack);
    }
    next();
  },

  agentProfileView: (req, res) => {
    res.render("agent/agentIndex");
  },

  updateMainInfo: async (req, res) => {
    let getMainInfo = await agentModel.getMainInfo(req.params.id);

    let image1 = getMainInfo[0][0].a_image1;
    let image2 = getMainInfo[0][0].a_image2;
    let image3 = getMainInfo[0][0].a_image3;
    let introduction = getMainInfo[0][0].a_introduction;

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
      console.log(req.params.id);
      res.locals.redirect = `/agent/${req.params.id}`;
      next();
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
    if (!req.cookies.authToken) return res.send("로그인 필요합니다");
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
  },

  settingsView: (req, res) => {
    res.render("agent/settings");
  },

  updateSettings: (req, res, next) => {
    if (!req.cookies.authToken) return res.send("로그인 필요합니다");
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let a_id = decoded.userId;
    const body = req.body;
    if (a_id === null) res.send("로그인이 필요합니다.");
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
  },
  updatePassword: (req, res, next) => {
    if (!req.cookies.authToken) return res.send("로그인 필요합니다");
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    const a_id = decoded.userId;
    if (a_id === null) res.send("로그인이 필요합니다.");
    else {
      agentModel.updateAgentPassword(a_id, req.body, (result, err) => {
        if (result === null) {
          if (err === "pwerror") {
            // res.locals.pwerr = "pwerror";
            res.locals.redirect = "/agent/settings";
            next();
          }
        } else {
          res.locals.redirect = "/agent/settings";
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
