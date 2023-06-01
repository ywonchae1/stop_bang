const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// const passwordSchema = require("../models/passwordValidator");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
var appDir = path.dirname(require.main.filename);

router.get("/register", authController.registerView);

router.post("/send-mail", async (req, res, next) => {
  var email = req.body.email;

  //console.log(sendEmail(email, fullUrl));

  connection.query(
    'SELECT * FROM verifications WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;

      var type = "success";
      var msg = "Email already verified";

      console.log(result[0]);

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

      console.log(result[0].verify);

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
