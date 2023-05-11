const express = require('express');
const router = express.Router();

//Controllers
const residnetController = require('../controllers/residentController.js');

router.use((req, res, next) => {
	console.log('Router for resident page was started');
	next();
});

router.get('/myReviews', residentController.reviewList);

module.exports = router;
