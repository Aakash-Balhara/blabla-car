const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenAuth");
const authController = require("../controllers/authController");


router.get("/", (req, res) => res.redirect("/home"));
router.get("/home", token, authController.getHome);

router.get("/signin", authController.getSignin);
router.post("/register", authController.register);
router.get("/successEmail", authController.getSuccessPage);
router.get("/verifyEmail", authController.verifyEmail);     

router.get("/login", authController.getLogin);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/forget", authController.getForget);
router.post("/forget", authController.forgetPassword);

router.get("/reset", authController.getReset);
router.post("/reset", authController.resetPassword);

module.exports = router;