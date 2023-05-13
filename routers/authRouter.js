const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register/agent", authController.registerAgent);

router.get("/register/resident", authController.registerResident);

router.get("/login", authController.login);

module.exports = router;
