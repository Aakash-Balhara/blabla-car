const AuthDb = require("../module/authDb");
const bookingDb = require("../module/bookingDb");
const rideDb = require("../module/rideInfo");
const RideRequestDb = require("../module/rideRequestDb");


exports.getBookRidePage = async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await rideDb.findById(rideId);
        res.status(200).render("bookRide", { ride });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("error in booking page");
    }
};

exports.getUserRides = async (req, res) => {
    try {
        const userid = req.user.id;
        const bookings = await bookingDb.find({ bookedByUserId: userid }).populate("rideId");

        const userRides = bookings.map((booking) => ({
            booking,
            ride: booking.rideId || null
        }));

        res.status(200).render("userRides", { userRides })
    }
    catch (err) {
        console.log(err);
        res.status(500).send("internal server error");
    }
};

exports.checkRatingAllowed = async (req, res) => {
    try {
        const { rideId, bookingId } = req.body;
        const ride = await rideDb.findById(rideId);
        const rideTime = ride.time;
        const [rhour, rmin] = rideTime.split(":");
        const rideDateTime = new Date(ride.date);
        rideDateTime.setHours(rhour, rmin, 0, 0);
        const currTime = new Date();
        if (rideDateTime <= currTime) {
            await bookingDb.findByIdAndUpdate(bookingId, { ratingStat: "Allowed" });
            return res.status(200).json({ status: "Allowed", message: "now you can rate this ride." });
        } else {
            return res.status(403).json({ status: "Not allowed", message: "You can rate this ride now." });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during rating time check" });
    }
};

exports.submitRating = async (req, res) => {
    const { bookingId, rating } = req.body;
    console.log(bookingId, rating);

    if (rating > 5 || rating < 1) {
        return res.status(400).json("please select stars");
    }
    try {
        const updated = await bookingDb.findByIdAndUpdate(bookingId, { rating: rating }, { new: true });

        res.status(200).json({ message: "Rating updated", updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.confirmBooking = async (req, res) => {
    try {
        const { passengers, bookingType, otherName, otherEmail, rideId } = req.body;
        const loggedinId = req.user.id;

        const rider = await rideDb.findById(rideId);

        const passengerCount = parseInt(passengers);

        if (passengerCount > rider.availableSeats) {
            return res.status(400).json({ message: "Not such seats available" });
        }
        if (passengerCount < 1) {
            return res.status(400).json({ message: "your value should be negative" });
        }

        const rideRequest = await RideRequestDb.create({
            rideId,
            requestedBy: loggedinId,
            passengers,
            bookingType,
            otherName,
            otherEmail,
        });

        const io = req.app.get('io');
        const riderSocketRoom = `rider_${rider.riderId}`;
        console.log("IO instance:", req.app.get("io"));

        io.to(riderSocketRoom).emit('new_request', {
            rideId: rider._id,
            passengers,
            requestedBy: req.user.name || 'Someone',
        });

        return res.status(200).json({ message: "Request sent successfully", requestId: rideRequest._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Request failed" });
    }
};
