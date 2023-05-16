//Models

const authModel = require("../models/authModel");

module.exports = {
  registerView: (req, res) => {
    res.render("users/register");
  },

  registerResident: (req, res) => {
    // 입력값에 필수 정보가 빠졌는지 확인하기
    const body = req.body;

    if (
      !body.username ||
      !body.password ||
      !body.phone ||
      !body.realname ||
      !body.email ||
      !body.birth
    )
      return res.status(400).send("필수 항목 빠짐");

    // DB에 새로운 사용자 정보 저장히기
    authModel.registerResident(req.body, (userId) => {
      // 오류났을 때
      if (!userId) return res.status(400).send("회원가입 실패");

      // 회원가입 완료하면 사용자 userId를 쿠키에 저장하기
      res
        .cookie("authToken", userId, {
          maxAge: 86400_000,
          httpOnly: true,
        })
        .redirect("/");
    });
  },

  registerResidentView: (req, res) => {
    res.render("users/resident/register");
  },

  registerAgent: (req, res) => {
    // 입력값에 필수 정보가 빠졌는지 확인하기
    const body = req.body;

    if (
      !body.agentList_ra_regno ||
      !body.username ||
      !body.password ||
      !body.realname ||
      !body.email ||
      !body.authimage
    )
      return res.status(400).send("필수 항목 빠짐");

    // DB에 새로운 공인중개사 정보 저장히기
    authModel.registerAgent(req.body, (userId) => {
      if (!userId) return;

      // 회원가입 완료하면 공인중개사 userId를 쿠키에 저장하기
      res.cookie("authToken", userId, {
        maxAge: 86400_000,
        httpOnly: true,
      });
    });
  },

  registerAgentView: (req, res) => {
    res.render("users/agent/register");
  },

  login: (req, res) => {
    // 입력값에 필수 정보가 빠졌는지 확인하기
    const body = req.body;
    console.log("🚀 ~ body:", body);

    if (!body.username || !body.password)
      return res.status(400).send("필수 항목 빠짐");

    // 로그인하기
    authModel.getUser(req.body, (userId) => {
      // 오류났을 때
      if (!userId) return res.render("users/login");

      // 로그인 성공하면 사용자/공인중개사 userId를 쿠키에 저장하기
      res
        .cookie("authToken", userId, {
          maxAge: 86400_000,
          httpOnly: true,
        })
        .redirect("/");
    });
  },

  loginView: (req, res) => {
    res.render("users/login");
  },

  logout: (req, res) => {
    res.clearCookie("authToken").redirect("/");
  },
};
