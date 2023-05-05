const express = require('express');
const morgan = require('morgan'); //추가적인 로그 볼수있게
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

dotenv.config();

app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//static: 정적파일 제공
//__dirname은 현재 파일의 절대경로로, path.join을 통해, pulbic 폴더를 합쳐 public폴더의 절대 경로 만들어줌.
app.use('/',express.static(path.join(__dirname, 'public')));

//폼 데이터, ajax 요청의 데이터 처리(json,url-encoded 처리)
//멀티파트(이미지,동영상,파일)은 multer모듈로 처리
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//요청에 동봉된 쿠키해석해 req.cookies객체로 만듦
app.use(cookieParser(process.env.COOKIE_SECRET));

//세션 관리용(로그인, 세션쿠키)
/*
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));
*/

app.use(morgan('dev'));
/*
app.use((req,res,next)=>{
    console.log('모든 요청에 실행');
    next();
});



app.get('/',(req,res)=>{
    res.render('./views/index.ejs')
});
*/

app.listen(app.get('port'),()=>{

    console.log(app.get('port'),'번 포트에게 대기중');
});


const indexRouter = require('./routers');
const searchRouter = require('./routers/search');

app.use('/',indexRouter);
app.use('/search',searchRouter);
app.use((req,res,next)=>{
    res.status(404).send('Not Found');
});


