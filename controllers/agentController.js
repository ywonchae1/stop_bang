//Models
const agentModel = require("../models/agentModel.js");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");

module.exports = {
  myReview: (req, res) => {
    agentModel.getReviewByRaRegno(req.params, (agentReviews) => {
      console.log(agentReviews);
      cmpName = agentReviews[0].cmp_nm;
      raRegno = agentReviews[0].ra_regno;
      res.render("agent/agentIndex.ejs", {
        title: `${cmpName}의 후기`,
        agentReviewData: agentReviews,
        direction: `/review/${cmpName}/create`,
        raRegno: raRegno,
      });
    });
  },

  getAgentPhoneNumber: async (req, res) => {
    if (!req.query.raRegno) return res.send("Requires `raRegno`");

    try {
      const agent = await db.query(
        `SELECT telno FROM agentList WHERE ra_regno = ?`,
        [req.query.raRegno]
      );
      return res.send({ phoneNumber: agent[0][0].telno });
    } catch (error) {
      return res.send(error.message);
    }
  },

  myReviewView: (req, res) => {
    res.render("agent/agentIndex");
  },

  //후기 신고
	reporting: async (req, res) => {
		//쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    let a_id = decoded.userId;
		if(a_id === null) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
		ra_regno = await agentModel.reportProcess(req, a_id);
		console.log("신고완료");
	  res.redirect(`${req.baseUrl}/${ra_regno[0][0].agentList_ra_regno}`);
	},

  agentProfile: async (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
    const decoded = jwt.verify(
      req.cookies.authToken,
      process.env.JWT_SECRET_KEY
    );
    try {
      let agent = await agentModel.getAgentProfile(req.params.id);
      let getMainInfo = await agentModel.getMainInfo(req.params.id);
      //다른 공인중개사 페이지 접근 제한(수정제한으로 수정 필요할지도)
      if (getMainInfo.a_id !== decoded.userId)
        res.render('notFound.ejs', {message: "접근이 제한되었습니다. 공인중개사 계정으로 로그인하세요"});
      let getEnteredAgent = await agentModel.getEnteredAgent(req.params.id);
      let getReviews = await agentModel.getReviewByRaRegno(req.params.id);
      let getReport = await agentModel.getReport(req.params.id, decoded.userId);
      let getRating = await agentModel.getRating(req.params.id);
      res.locals.agent = agent[0];
      res.locals.agentMainInfo = getMainInfo;
      res.locals.agentSubInfo = getEnteredAgent[0][0];
      res.locals.agentReviewData = getReviews;
      res.locals.report = getReport;

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
  },

  agentProfileView: (req, res) => {
    res.render("agent/agentIndex");
    // next();
  },

  // agentMainInfo: (req, res, next) => {
  // 	agentModel.getMainInfo(id, (result, err) => {
  // 	  if (result === null) {
  // 		console.log(result);
  // 		console.log("error occured: ", err);
  // 	  } else {
  // 		res.locals.agent = result[0];
  // 		next();
  // 	  }
  // 	});
  // },

  // agentMainInfoView: (req, res,next) => {
  // 	res.render("agent/agentMainInfo");
  // 	next();
  // },

  updateMainInfo: (req, res) => {
    agentModel.getMainInfo(req.params, (agentMainInfo) => {
      let image1 = agentMainInfo.a_image1;
      let image2 = agentMainInfo.a_image2;
      let image3 = agentMainInfo.a_image3;
      let introduction = agentMainInfo.a_introduction;

      let title = `소개글 수정하기`;
      res.render("agent/updateMainInfo.ejs", {
        title: title,
        agentId: req.params.a_id,
        image1: image1,
        image2: image2,
        image3: image3,
        introduction: introduction,
      });
    });
  },

  updatingMainInfo: (req, res) => {
    agentModel.updateMainInfo(req.params, req.body, () => {
      res.redirect(`agent/agenMainInfo`);
      //res.redirect(`/resident/${req.body.userName}/myReviews`);
    });
  },

  /*
	editMainInfo: (req, res, next) => {
		next();
	},
	updateMainInfo: (req, res, next) => {
		res.locals.redirect = "/agent/agentIndex";
		next();
	},
	*/

  // enteredagentInfo: (req, res, next) => {
  // 	agentModel.getEnteredAgent(id, (result, err) => {
  // 		if (result === null) {
  // 			console.log(result);
  // 			console.log("error occured: ", err);
  // 		} else {
  // 			res.locals.agent = result[0][0];
  // 			next();
  // 		}
  // 	});
  // },

  // enteredagentInfoView: (req, res) => {
  // 	res.render("agent/agentInformation");
  // },

  // unEnteredagentInfo: (req, res, next) => {
  // 	agentModel.getUnEnteredAgent(id, (result, err) => {
  // 		if (result === null) {
  // 			console.log(result);
  // 			console.log("error occured: ", err);
  // 		} else {
  // 			res.local.agent = result[0];
  // 			next();
  // 		}
  // 	});

  // },

  // unEnteredagentInfoView: (req, res) => {
  // 	res.render("agent/agentInformation");
  // },

  updateEnteredInfo: (req, res) => {
    agentModel.getEnteredAgent(req.params, (agentInfo) => {
      let profileImage = agentInfo.a_profile_image;
      let officeHour = agentInfo.a_office_hours;
      let contactNumber = agentInfo.contact_number;
      let telno = agentInfo.telno;

      let title = `부동산 정보 수정하기`;
      res.render("agent/updateAgentInfo.ejs", {
        title: title,
        agentId: req.params.agentList_ra_regno,
        profileImage: profileImage,
        officeHour: officeHour,
        contactNumber: contactNumber,
        telno: telno,
      });
    });
  },

  updatingEnteredInfo: (req, res) => {
    agentModel.updateEnterdAgentInfo(req.params, req.body, () => {
      res.redirect(`agent/agentInformation`);
      //res.redirect(`/resident/${req.body.userName}/myReviews`);
    });
  },

  /*
	updateUnEnteredInfo: (req, res) => {
		agentModel.getUnEnteredAgent(req.params, (agentInfo) => {
			let telno = agentInfo.telno;

			let title = `부동산 정보 수정하기`
			res.render('agent/updateAgentInfo.ejs', 
			{
				title: title, 
				agentId: req.params.agentList_ra_regno, 
				telno: telno
			});
		});
	},

	updatingUnEnteredInfo: (req, res) => {
		agentModel.updateUnEnterdAgentInfo(req.params, req.body, () => {
			res.redirect(`/agent/agentInformation`);
			//res.redirect(`/resident/${req.body.userName}/myReviews`);
		});
	},

	editInfo: (req, res, next) => {
		next();
	},
	updateInfo: (req, res, next) => {
		res.locals.redirect = "/agent/agentIndex";
		next();
	},

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath !== undefined) res.redirect(redirectPath);
		else next();
	},
	*/
  settings: (req, res, next) => {
    //쿠키로부터 로그인 계정 알아오기
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
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
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
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
  },
  updatePassword: (req, res, next) => {
    if (!req.cookies.authToken) res.render('notFound.ejs', {message: "로그인이 필요합니다"});
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
