const port = 3000
const http = require('http');
const express = require('express');
const app = express();
const url = require('url');
const fs = require('fs');


//html 템플릿
const template = require('./views/template.js');


//post에서 body 받기
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//DB관련
require('dotenv').config();
const mysql2 = require('mysql2');

let loginDB = async() => {
	const db = mysql2.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PW,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		waitForConnections: true,
		insecureAuth: true
	});

	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	//입주민이 보는 공인중개사 홈페이지
	app.get('/home/:cmp_nm', (req, res) => {
		let rawQuery = `SELECT rv_id, rating, content, cmp_nm, ra_regno FROM review JOIN agentList ON agentList_ra_regno=ra_regno WHERE cmp_nm=?`;
		let cmpName = req.params.cmp_nm;
		db.query(rawQuery, [cmpName], (err, agentReviews) => {
			let raRegno = agentReviews[0].ra_regno;
			let reviewList = template.listHTML(agentReviews);
			let html = template.reviewHTML(`${cmpName}의 후기`, reviewList, `
			<form action='/review/${cmpName}/create' method='post'>
				<input type='hidden' name='raRegno' value="${raRegno}">
				<p><input type='submit' value='후기 작성하고 휴지 받기'></p>
			</form>`);

			res.send(html);
		});
	});


	//(후기 작성하고 휴지 받기) 버튼 눌렀을 때
	//입주민의 후기 작성 페이지
	app.post('/review/:cmp_nm/create', (req, res) => {
		console.log(req.body);
		let cmpName = req.params.cmp_nm;
		let raRegno = req.body.raRegno;
		let title = `${cmpName} 후기 작성하기`
		let html = template.reviewHTML(title, '', `
		<form action='/review/${cmpName}/create_process' method='post'>
			<input type='hidden' name='raRegno' value=${raRegno}>
			<p><input type='text' name='rate' placeholder='별점0-5'></p>
			<p><textarea name='description' placeholder='부동산에 대해 솔직한 후기를 작성해 주세요!'></textarea></p>
			<input type='submit' value='등록'>
		</form>
		<form action='/home/${cmpName}' method='get'>
			<input type='submit' value='취소'>
		</form>
		`);

		res.send(html);
	});


	//DB 후기 추가
	app.post('/review/:cmp_nm/create_process', (req, res) => {
		console.log(req.body);
		let cmpName = req.params.cmp_nm;
		let raRegno = req.body.raRegno;
		let rate = req.body.rate;
		let description = req.body.description;
		let rawQuery = `INSERT INTO review(resident_r_id, agentList_ra_regno, rating, content) VALUES(3, ?, ?, ?)`;
		db.query(rawQuery, [raRegno, rate, description], (err) => {
			res.redirect(`/home/${cmpName}`);
		});
	});


	//입주민 마이페이지 작성한 후기 페이지
	app.get('/:r_username/myReviews', (req, res) => {
		let userName = req.params.r_username;
		let rawQuery = `SELECT r_id, rv_id, r_username, rating, content FROM resident JOIN review ON r_id=resident_r_id WHERE r_username=?`;
		db.query(rawQuery, [userName], (err, myReviewsData) => {
			let myReviewList = template.listHTML(myReviewsData, true);
			let html = template.reviewHTML(`${userName}님의 소중한 후기`, myReviewList);
			res.send(html);
		});
	});

	app.post('/review/:rv_id/update', (req, res) => {
		let reviewId = req.params.rv_id;
		let rawQuery = `SELECT rv_id, resident_r_id, r_username, cmp_nm, rating, content FROM resident JOIN (SELECT rv_id, resident_r_id, cmp_nm, rating, content FROM review JOIN agentList ON agentList_ra_regno=ra_regno) newTable ON resident.r_id=newTable.resident_r_id WHERE newTable.rv_id=?` 
		db.query(rawQuery, [reviewId], (err, reviewData) => {
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
			<form action='/${userName}/myReviews' method='get'>
				<input type='submit' value='취소'>
			</form>
			`);
			res.send(html);
		});
	});

	app.post('/review/:rv_id/update_process', (req, res) => {
		let reviewId = req.params.rv_id;
		let rawQuery = `UPDATE review SET rating=?, content=? WHERE rv_id=?`;
		db.query(rawQuery, [req.body.rate, req.body.description, reviewId], (err) => {
			res.redirect(`/${req.body.userName}/myReviews`);
		});
	});

	app.post('/review/:rv_id/delete_process', (req, res) => {
		let reviewId = req.params.rv_id;
		let rawQuery = `DELETE FROM review WHERE rv_id=?`;
		db.query(rawQuery, [reviewId], (err) => {
			res.redirect(`/${req.body.userName}/myReviews`);
		});
	});

};
loginDB();

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
