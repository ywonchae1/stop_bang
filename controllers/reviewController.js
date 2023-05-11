//db정보받기
const db = require('../config/db.js');

//html 템플릿
const template = require('../views/template.js');

//후기 추가
exports.createReview = (req, res) => {
	console.log(req.body);
	let cmpName = req.params.cmp_nm;
	let raRegno = req.body.raRegno;
	let title = `${cmpName} 후기 작성하기`
	let html = template.reviewHTML(title, '',
		`
		<form action='/review/${cmpName}/create_process' method='post'>
			<input type='hidden' name='raRegno' value=${raRegno}>
			<p><input type='text' name='rate' placeholder='별점0-5'></p>
			<p><textarea name='description' placeholder='부동산에 대해 솔직한 후기를 작성해 주세요!'></textarea></p>
			<input type='submit' value='등록'>
		</form>
		<form action='/agent/${cmpName}' method='get'>
			<input type='submit' value='취소'>
		</form>
		`);

	res.send(html);
};


//후기 추가 DB 반영
exports.creatingReview = (req, res) => {
	console.log(req.body);
	let cmpName = req.params.cmp_nm;
	let raRegno = req.body.raRegno;
	let rate = req.body.rate;
	let description = req.body.description;
	let rawQuery = `INSERT INTO review(resident_r_id, agentList_ra_regno, rating, content) VALUES(3, ?, ?, ?)`;
	db.dbInfo.query(rawQuery, [raRegno, rate, description], (err) => {
		res.redirect(`/agent/${cmpName}`);
	});
};


//후기 수정
exports.updateReview = (req, res) => {
	let reviewId = req.params.rv_id;
	let rawQuery = `SELECT rv_id, resident_r_id, r_username, cmp_nm, rating, content FROM resident JOIN (SELECT rv_id, resident_r_id, cmp_nm, rating, content FROM review JOIN agentList ON agentList_ra_regno=ra_regno) newTable ON resident.r_id=newTable.resident_r_id WHERE newTable.rv_id=?` 
	db.dbInfo.query(rawQuery, [reviewId], (err, reviewData) => {
		let cmpName = reviewData[0].cmp_nm;
		let userName = reviewData[0].r_username;
		let rate = reviewData[0].rating;
		let description= reviewData[0].content;

		let title = `${cmpName} - ${userName}님의 후기 수정하기`
		let html = template.reviewHTML(title, '', `
			<form action='/review/${reviewId}/update_process' method='post'>
				<input type='hidden' name='userName' value=${userName}>
				<p><input type='text' name='rate' placeholder='별점0-5' value=${rate}></p>
				<p><textarea name='description' placeholder='부동산에 대해 솔직한 후기를 작성해 주세요!'>${description}</textarea></p>
				<input type='submit' value='등록'>
			</form>
			<form action='/resident/${userName}/myReviews' method='get'>
				<input type='submit' value='취소'>
			</form>
			`);
		res.send(html);
	});
};


//후기 수정 DB 반영
exports.updatingReview = (req, res) => {
	let reviewId = req.params.rv_id;
	let rawQuery = `UPDATE review SET rating=?, content=? WHERE rv_id=?`;
	db.dbInfo.query(rawQuery, [req.body.rate, req.body.description, reviewId], (err) => {
		res.redirect(`/resident/${req.body.userName}/myReviews`);
	});
};
