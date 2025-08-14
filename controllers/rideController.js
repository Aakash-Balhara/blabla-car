// controllers/rideController.js
const rideDb = require("../module/rideInfo");
const authDb=require("../module/authDb");

exports.getRideFormPage = (req, res) => {
    res.status(200).render("rideForm");
};

exports.createRide = async (req, res) => {
    try {
          const { from, to, date, time, availableSeats, price } = req.body;

        if (!from || !to || !date || !time || !availableSeats || !price) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }
        
        const rideDate = new Date(req.body.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        rideDate.setHours(0, 0, 0, 0);

        if (rideDate < today) {
            return res.status(400).json({ message: "Cannot publish ride in the past." });
        }

        if(availableSeats<=0){
            return res.status(400).json({ message: "Enter possitive number to book a ride" });
        }

        const newRide = new rideDb({
            ...req.body,
            userId: req.user.id,
        });
        await newRide.save();
        res.status(201).json({ message: "Ride offered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json("error in saving ride info");
    }
};

exports.getAllRides = async (req, res) => {
    try {
        const rides = await rideDb.find();
        const today = new Date().setHours(0, 0, 0, 0);
        const updatedRides = rides.filter(ride => {
            const rideDate = new Date(ride.date).setHours(0, 0, 0, 0);
            return rideDate >= today;
        });
        res.status(200).json(updatedRides);
    } catch (err) {
        res.status(500).json({ err: "failed to load rides" });
    }
};

exports.searchRidesByLocation = async (req, res) => {
    const { from, to } = req.params;
    try {
        const userId=req.user.id;
        console.log("userid",userId);
        const allRides = await rideDb.find({ from, to });

        const rides=allRides.filter(ride=>{
            return ride.userId!=userId;
        })

        res.status(200).render("allRidesInfo", { rides, from, to });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching rides.");
    }
};
