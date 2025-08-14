const rideRequestDb = require("../module/rideRequestDb");
const rideDb = require("../module/rideInfo");
const bookingDb = require("../module/bookingDb");

exports.getRideRequestsForRider = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching requests for rider:", req.user, userId);

    const riderRides = await rideDb.find({ userId: userId });
    console.log("riderRides", riderRides);
    const rideIds = riderRides.map(ride => ride._id);
    console.log("rideIds", rideIds);

    const requests = await rideRequestDb.find({
      rideId: { $in: rideIds },
      status: "pending"
    }).populate("requestedBy").populate("rideId");

    console.log(requests);
    res.render("riderInbox", { requests });

  } catch (err) {
    console.error("Error fetching ride requests:", err);
    res.status(500).send("Server Error");
  }
};

exports.respondToRideRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;

    const request = await rideRequestDb.findById(requestId).populate("requestedBy");;
    if (!request) return res.status(404).send("Request not found");

    if (action !== "accepted" && action !== "rejected") {
      return res.status(400).send("Invalid action");
    }

    request.status = action;
    await request.save();

    if (action === "accepted") {
      const bookingData = {
        rideId: request.rideId,
        bookedByUserId: request.requestedBy._id,
        passengers: request.passengers,
        bookedAt: new Date()
      };

      if (request.bookingType === "self") {
        bookingData.bookedFor = {
          name: request.requestedBy.firstName,
          email: request.requestedBy.email
        };
      }
      else if (request.bookingType === "other") {
        bookingData.bookedFor = {
          name: request.otherName,
          email: request.otherEmail
        };
      }

      const passengerCount = request.passengers;
      const ride = await rideDb.findById(request.rideId);
      if (!ride) {
        return res.status(404).send("Ride not found");
      }

      if (ride.availableSeats < passengerCount) {
        return res.status(400).send("Not enough available seats");
      }

      ride.availableSeats -= passengerCount;
      await ride.save();

      const saveBooking = await bookingDb.create(bookingData);
      console.log("Booking created:", saveBooking);
    }

    const io = req.app.get("io");
    const userSocketId = req.app.get("userSocketId");
    const passengerId = request.requestedBy._id.toString();
    const passengerSocket = userSocketId[passengerId];

    if (passengerSocket) {
      io.to(passengerSocket).emit("notification", {
        type: "ride_response",
        status: action,
        message: `Your ride request was ${action}.`
      });
    }

    res.redirect("/home");
  } catch (err) {
    console.error("Error responding to request:", err);
    res.status(500).send("Server Error");
  }
};
