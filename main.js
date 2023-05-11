const port = 3000
const http = require('http');
const express = require('express');
const app = express();
const url = require('url');
const fs = require('fs');

//post에서 body 받기
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Routers
const agentRouter = require('./routers/agentRouter.js');
const reviewRouter = require('./routers/reviewRouter.js');

//View
const layouts = require('express-ejs-layouts');
app.set("view engine", "ejs");

let loginDB = async() => { //이거 꼭 써야 할까?

	const db = require('./config/db.js');

	app.get('/', (req, res) => {
		res.send('Hello World!');
	});

	//공인중개사 페이지 접근
	app.use('/agent', agentRouter);

	//후기 접근
	app.use('/review', reviewRouter);

};
loginDB();

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
