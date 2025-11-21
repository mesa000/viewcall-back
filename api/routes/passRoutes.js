const express = require("express");
const router = express.Router();
const PasswordController = require("../controllers/PasswordController");

router.post("/forgot-password", PasswordController.forgotPassword);
router.post("/reset-password/:token", PasswordController.resetPassword);

module.exports = router;
