const express = require('express');
const router = express.Router();

//Controllers
const agentController = require('../controllers/agentController.js');

router.use((req, res, next) => {
	console.log('Router for agent page was started');
	next();
});

//입주민이 보는 공인중개사 홈페이지
router.get('/:cmp_nm', agentController.mainPage);

module.exports = router;
