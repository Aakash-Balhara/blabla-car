const express = require("express");
const router = express.Router();
const rideRequestController = require("../controllers/rideRequestController");

router.get("/rider-requests", rideRequestController.getRideRequestsForRider);

router.post("/respond-request", rideRequestController.respondToRideRequest);

module.exports = router;
