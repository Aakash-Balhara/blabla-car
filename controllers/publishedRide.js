const AuthDb = require("../module/authDb");
const rideDb = require("../module/rideInfo");
const bookingDb = require("../module/bookingDb");

exports.publishedRides = async (req, res) => {
    try {
        const userid = req.user.id;
        const rides = await rideDb.find({ userId: userid });
        // console.log("rides",rides);
        const rideIds = rides.map(ride => ride._id);

        const bookings = await bookingDb.find({ rideId: { $in: rideIds } });
        const allPassangers = {};
        bookings.forEach(booking => {
            const rideId = booking.rideId.toString();

            if (!allPassangers[rideId]){ 
                allPassangers[rideId] = [];
            }

            allPassangers[rideId].push({
                name: booking.bookedFor.name,
                email: booking.bookedFor.email,
                passengers: booking.passengers,
                bookedByUserId:booking.bookedByUserId,
                bookingId: booking._id
            });
        });

        res.status(200).render("publishedRides", { rides, allPassangers });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching published rides");
    }
}
