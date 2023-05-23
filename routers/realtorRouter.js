const express = require('express');
const router = express.Router();

//Controllers
const realtorController = require('../controllers/realtorController.js');

router.use((req, res, next) => {
	console.log('Router for realtor page was started');
	next();
});

//입주민이 보는 공인중개사 홈페이지
router.get('/:ra_regno', realtorController.mainPage);

module.exports = router;
