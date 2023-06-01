const express = require("express");
//const multer = require('multer');
//const fs = require('fs');
//const path = require('path');
const router = express.Router();

//Controllers
const agentController = require("../controllers/agentController.js");
/*

const upload = multer({
	storage: multer.diskStorage({
		//이미지가 서버에 저장되도록함. destination 메소드로 저장경로 설정
		destination(req, file, cb) {
			cb(null, "public/images/");
		},
		filename(req, file, cb) {
			//기존이름 + 업로드날짜 + 기존 확장자(ext)를 합쳐서 메소드를 만듦
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024},
})

router.post('/upload', upload.single(img), (req, res) => {
	console.log(req.file);
	res.json({url : `\${req.file.filename}`});
})

*/
router.get("/phoneNumber", agentController.getAgentPhoneNumber);

//agent 사용자 정보 확인용
router.get("/settings", agentController.settings, agentController.settingsView);
router.post(
  "/settings/update",
  agentController.updateSettings,
  agentController.redirectView
);
router.post(
  "/settings/pwupdate",
  agentController.updatePassword,
  agentController.redirectView
);
//agent 홈 get
router.get(
  "/:id",
  agentController.agentProfile,
  agentController.agentProfileView
  // agentController.enteredagentInfo,
  // agentController.enteredagentInfoView,
  // agentController.agentMainInfo,
  // agentController.agentMainInfoView,
  // //agentController.myReview,
  // agentController.myReviewView
);
//agent info 수정(영업시간,전화번호)

router.get("/:id/update", agentController.updateEnteredInfo);

//후기 신고
router.get('/report/:rv_id', agentController.reporting);

module.exports = router;
