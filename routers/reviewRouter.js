const express = require('express');
const router = express.Router();

//Controllers
const reviewController = require('../controllers/reviewController.js');

router.use((req, res, next) => {
	console.log('Router for review page was started');
	next();
});

//(후기 작성하고 휴지 받기) 버튼 눌렀을 때
//후기 추가
router.post('/:cmp_nm/create', reviewController.createReview);

//후기 추가 DB 반영
router.post('/:cmp_nm/create_process', reviewController.creatingReview);

//후기 수정 버튼 눌렀을 때
router.get('/:rv_id/update', reviewController.updateReview);

//후기 수정 DB 반영
router.post('/:rv_id/update_process', reviewController.updatingReview);

module.exports = router;

/*삭제 보류
app.post('/review/:rv_id/delete_process', (req, res) => {
	let reviewId = req.params.rv_id;
	let rawQuery = `DELETE FROM review WHERE rv_id=?`;
	db.dbInfo.query(rawQuery, [reviewId], (err) => {
		res.redirect(`/${req.body.userName}/myReviews`);
	});
});
*/
