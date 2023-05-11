const express = require("express");
const layouts = require("express-ejs-layouts");
//const morgan = require("morgan"); //추가적인 로그 볼수있게
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const indexRouter = require("./routers/index"),
  residentRouter = require("./routers/residentRouter");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/user", residentRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에게 대기중");
});
