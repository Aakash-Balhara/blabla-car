const express = require("express");
const router=express.Router();
const checkLogin = require("../middleware/checkLogin");
const rideController = require("../controllers/rideController");


router.use(checkLogin);

router.get("/rideForm", rideController.getRideFormPage);
router.post("/rideForm", rideController.createRide);
router.get("/allRides", rideController.getAllRides);
router.get("/rideForm/:from-:to", rideController.searchRidesByLocation);

module.exports=router;