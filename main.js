const express = require("express");
//const morgan = require("morgan"); //추가적인 로그 볼수있게
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const bodyParser = require('body-parser'); //post에서 body 받기
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routers
const indexRouter = require("./routers/index"),
	residentRouter = require("./routers/residentRouter"),
	agentRouter = require('./routers/agentRouter.js'),
	reviewRouter = require('./routers/reviewRouter.js');

//View
const layouts = require('express-ejs-layouts');
app.set("view engine", "ejs");
app.use(layouts);

app.set("port", process.env.PORT || 3000);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/user", residentRouter);

//공인중개사 페이지 접근
app.use('/agent', agentRouter);

//후기 접근
app.use('/review', reviewRouter);

app.listen(app.get("port"), () => {
	console.log(app.get("port"), "번 포트에게 대기중");
});
