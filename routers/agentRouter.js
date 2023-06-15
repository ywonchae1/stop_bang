const express = require("express");
const router = express.Router();

//Controllers
const agentController = require("../controllers/agentController.js");

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
);

//agent info 수정(영업시간,전화번호)
router.get("/:id/update", agentController.updateEnteredInfo);

router.post(
  "/:id/update_process",
  agentController.upload.single("myImage"),
  agentController.updatingEnteredInfo,
  agentController.redirectView
);

router.get("/:id/info_edit", agentController.updateMainInfo);
router.post(
  "/:id/edit_process",
  agentController.upload.fields([{name: 'myImage1'}, {name: 'myImage2'}, {name: 'myImage3'}]),
  agentController.updatingMainInfo,
  agentController.redirectView
);

//후기 신고
router.get('/report/:rv_id', agentController.reporting);

router.post(
  "/deleteAccount",
  agentController.deleteAccount
);

module.exports = router;
