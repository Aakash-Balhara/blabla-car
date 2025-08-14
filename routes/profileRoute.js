const express = require("express");
const router=express.Router();
const AuthDb = require("../module/authDb");
const rideDb = require("../module/rideInfo");
const checkLogin = require("../middleware/checkLogin");
const profileController=require("../controllers/profileController");
router.use(checkLogin);


router.get("/profile",profileController.profile);

module.exports=router;