const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", authController.registerView);

router.get("/register/agent", authController.registerAgentView);
router.post("/register/agent", authController.registerAgent);

router.get("/register/resident", authController.registerResidentView);
router.post("/register/resident", authController.registerResident);

router.get("/login", authController.loginView);
router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;
