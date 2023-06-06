const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// const passwordSchema = require("../models/passwordValidator");
const mailer = require("../modules/mailer");
const path = require("path");
const db = require("../config/db");

const _makeCertificationKey = () => {
  var key = ""; // 인증키

  // 난수 생성 후 인증키로 활용
  for (var i = 0; i < 5; i++) {
    key = key + Math.floor(Math.random() * (10 - 0));
  }

  return key;
};

router.get("/register", authController.registerView);

router.post("/certification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).send("Invalid Param");
    }

    const code = _makeCertificationKey();
    const [rows, fields] = await db.query(
      `SELECT * FROM certification WHERE email='${email}'`
    );
    if (rows.length > 0) {
      await db.query(
        `UPDATE certification SET code='${code}' WHERE email='${email}'`
      );
    } else {
      await db.query("INSERT INTO certification (email, code) VALUE(?, ?);", [
        email,
        code,
      ]);
    }
    await mailer.sendEmail(email, code);
    res.send("Success!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.post("/certification-check", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (
      !email ||
      typeof email !== "string" ||
      !code ||
      typeof code !== "string"
    ) {
      return res.status(400).send("Invalid Param");
    }

    const [rows, fields] = await db.query(
      `SELECT * FROM certification WHERE email='${email}' AND code='${code}'`
    );
    if (!rows[0]) {
      return res.status(404).send("Data Not Found.");
    }

    res.send("Success!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.post("/send-mail", async (req, res, next) => {
  var email = req.body.email;

  // console.log(sendEmail(email, fullUrl));

  connection.query(
    'SELECT * FROM verifications WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;

      var type = "success";
      var msg = "Email already verified";

      console.log("jjj", result[0]);

      if (result.length > 0) {
        var token = randtoken.generate(20);

        if (result[0].verify == 0) {
          var sent = sendEmail(email, token);
          if (sent != "0") {
            var data = {
              token: token,
            };

            connection.query(
              'UPDATE verifications SET ? WHERE email ="' + email + '"',
              data,
              function (err, result) {
                if (err) throw err;
              }
            );

            type = "success";
            msg = "The verification link has been sent to your email address";
          } else {
            type = "error";
            msg = "Something goes to wrong. Please try again";
          }
        }
      } else {
        console.log("2");
        type = "error";
        msg = "The Email is not registered with us";
      }

      req.flash(type, msg);
      res.redirect("/");
    }
  );
});

/* send verification link */
router.get("/verify-email", function (req, res, next) {
  connection.query(
    'SELECT * FROM verifications WHERE token ="' + req.query.token + '"',
    function (err, result) {
      if (err) throw err;

      var type;
      var msg;

      console.log("lll", result[0].verify);

      if (result[0].verify == 0) {
        if (result.length > 0) {
          var data = {
            verify: 1,
          };

          connection.query(
            'UPDATE verifications SET ? WHERE email ="' + result[0].email + '"',
            data,
            function (err, result) {
              if (err) throw err;
            }
          );
          type = "success";
          msg = "Your email has been verified";
        } else {
          console.log("2");
          type = "success";
          msg = "The email has already verified";
        }
      } else {
        type = "error";
        msg = "The email has been already verified";
      }

      req.flash(type, msg);
      res.redirect("/");
    }
  );
});

router.get("/register/agent", authController.registerAgentView);
router.post("/register/agent", authController.registerAgent);

router.get("/register/resident", authController.registerResidentView);
router.post("/register/resident", authController.registerResident);

router.get("/login", authController.loginView);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;
