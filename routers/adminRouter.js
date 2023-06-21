const express = require("express");
const router = express.Router();
const db = require("../config/db");
const adminControl = require("../controllers/adminController");

router.get("/", async (req, res, next) => {
  //쿠키로부터 로그인 계정 알아오기
  if (req.cookies.authToken == undefined)
  res.render("notFound.ejs", { message: "로그인이 필요합니다" });
  try {
    const result1 = await adminControl.getNewUsersCount();
    const result2 = await adminControl.getNewAgent();
    const result3 = await adminControl.getReports();

    const userCount = result1[0].userCount;
    const newAgent = result2;
    const reports = result3;
    //console.log("user count : "+userCount, "new agent : "+newAgent);
    res.render("admin/admin", {
      userCount: userCount,
      newAgent: newAgent,
      reports: reports,
    });
  } catch (error) {
    console.log(error);
  }
}),
  router.get("/newagent", async (req, res, next) => {
    try {
      const result2 = await adminControl.getNewAgent();
      const newAgent = result2;
      res.render("admin/adminAgentCheck", { newAgent: newAgent });
    } catch (error) {
      console.log(error);
    }
  }),
  router.get("/newagent/confirm/:regno", async (req, res, next) => {
    try {
      const regno = req.params.regno;
      const result = await adminControl.getAgent(regno);
      const agent_info = result[0];
      res.render("admin/adminAgentConfirm", { agent_info: agent_info });
    } catch (error) {
      console.log(error);
    }
  }),
  router.post("/newagent/confirmed", async (req, res, next) => {
    try {
      const regno = req.body.regno;
      const a_id = req.body.a_id;
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  }),
  router.get("/reports", async (req, res, next) => {
    try {
      const result = await adminControl.getReports();
      const reports = result;
      res.render("admin/adminReportCheck", { reports: reports });
    } catch (error) {
      console.log(error);
    }
  }),
  router.get("/reports/confirm/:rvid/:reporter", async (req, res, next) => {
    try {
      const rvid = req.params.rvid;
      const reporter = req.params.reporter;
      const result = await adminControl.getOneReport(rvid, reporter);
      const reports = result[0];
      res.render("admin/adminReportConfirm", { reports: reports });
    } catch (error) {
      console.log(error);
    }
  }),
  router.post("/reports/deleted", async (req, res, next) => {
    console.log("IN THE ROUTER !");
    try {
      const rvid = req.body.rvid;
      const ridof = await adminControl.deleteComment(rvid);
      res.redirect("/admin/reports");
    } catch (error) {
      console.log(error);
    }
  }),
  router.post("/reports/rejec", async (req, res, next) => {
    try {
      const rvid = req.body.rvid;
      const rejected = await adminControl.deleteReport(rvid);
      res.redirect("/admin/reports");
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
