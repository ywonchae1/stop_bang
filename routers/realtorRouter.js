const express = require("express");
const router = express.Router();

//Controllers
const realtorController = require("../controllers/realtorController.js");

router.use((req, res, next) => {
  console.log("Router for realtor page was started");
  next();
});

//입주민이 보는 공인중개사 홈페이지

router.get(
  '/:ra_regno',
  realtorController.mainPage,
  realtorController.realtorView
);
router.post(
  "/:ra_regno/bookmark",
  realtorController.updateBookmark

);

//후기를 열람할 때
router.post(
  '/:ra_regno/opening/:rv_id',
  realtorController.opening
);

//후기 신고
router.get('/report/:rv_id', realtorController.reporting);

module.exports = router;
