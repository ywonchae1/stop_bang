//Models

const authModel = require("../models/authModel");

module.exports = {
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
      return res.status(400);

    // DB에 새로운 사용자 정보 저장히기
    authModel.registerResident(req.body, (userId) => {
      // 오류났을 때
      if (!userId) return;

      // 회원가입 완료하면 사용자 userId를 쿠키에 저장하기
      res.cookie("authToken", userId, {
        maxAge: 86400_000,
        httpOnly: true,
      });
    });
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
      !body.image1
    )
      return res.status(400);

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

  login: (req, res) => {
    // 입력값에 필수 정보가 빠졌는지 확인하기
    if (!req.body.username || !req.body.password) return res.status(400);

    // 로그인하기
    authModel.getUser(req.body, (userId) => {
      // 오류났을 때
      if (!userId) return;

      // 로그인 성공하면 사용자/공인중개사 userId를 쿠키에 저장하기
      res.cookie("authToken", userId, {
        maxAge: 86400_000,
        httpOnly: true,
      });
    });
  },
};
