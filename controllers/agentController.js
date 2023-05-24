//Models
const agentModel = require("../models/agentModel.js");
let id = "00599";

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

  myReviewView: (req, res) => {
    res.render("agent/agentIndex");
  },

  agentProfile: async (req, res, next) => {
    await agentModel.getAgentProfile(id, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.agent = result[0][0];
      }
    });
    await agentModel.getMainInfo(id, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        console.log(result);
        res.locals.agentMainInfo = result;
      }
    });
    await agentModel.getEnteredAgent(id, (result, err) => {
      if (result === null) {
        console.log(result);
        console.log("error occured: ", err);
      } else {
        res.locals.agentSubInfo = result[0][0];
        console.log(result[0]);
      }
    });
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
    let a_id = req.cookies.authToken;
    if (a_id == null) res.send("로그인이 필요합니다.");
    else {
      agentModel.getAgentById(a_id, (result, err) => {
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
    res.render("agent/settings");
  },
  updateSettings: (req, res, next) => {
    let a_id = req.cookies.authToken;
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
    const a_id = req.cookies.authToken;
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
