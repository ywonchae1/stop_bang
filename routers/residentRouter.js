const router = require("express").Router();
const residentController = require("../controllers/residentController");

router.get(
  "/myReview",
  residentController.myReview,
  residentController.myReviewView
);
router.get(
  "/openreview",
  residentController.openReview,
  residentController.openReviewView
);
router.get(
  "/bookmark",
  residentController.bookmark,
  residentController.bookmarkView
);
router.post(
  "/bookmark/:id/delete",
  residentController.deleteBookmark,
  residentController.redirectView
);
router.get(
  "/settings",
  residentController.settings,
  residentController.settingsView
);

router.post(
  "/settings/update",
  residentController.updateSettings,
  residentController.redirectView
);

// router.get("/settings/password", residentController.editPassword);
// router.post(
//   "/settings/pwupdate",
//   residentController.updatePassword,
//   residentController.redirectView
// );

module.exports = router;
