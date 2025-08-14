const express = require("express");
const router=express.Router();
const token = require("../middleware/tokenAuth");
const checkLogin = require("../middleware/checkLogin");
const bookingController = require("../controllers/bookingController");

router.use(checkLogin);

router.get('/bookRide/:rideId', bookingController.getBookRidePage);
router.post("/confirmBooking", token, bookingController.confirmBooking);
router.get("/userRides", bookingController.getUserRides);
router.post("/rateing", bookingController.checkRatingAllowed);
router.post("/submitRating", bookingController.submitRating);

module.exports=router;