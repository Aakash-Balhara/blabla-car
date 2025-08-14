const express = require("express");
const router=express.Router();
const AuthDb = require("../module/authDb");
const rideDb = require("../module/rideInfo");
const checkLogin = require("../middleware/checkLogin");
const pubRide=require("../controllers/publishedRide");
router.use(checkLogin);

router.get("/publishedRides",pubRide.publishedRides);

module.exports=router;