const rideDb = require("../module/rideInfo");

exports.getSearch = (req, res) => {
    res.render("search");
}


exports.search = async (req, res) => {
    const { from, to, selectedDate, passanger } = req.body;

    if (!from || !to || !selectedDate || !passanger) {
        return res.status(400).json({ error: "Missing fields." });
    }

    try {
        const date = new Date(selectedDate);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(startOfDay).setHours(23, 59, 59, 999));


        const rides = await rideDb.find({ from, to,  date: { $gte: startOfDay, $lte: endOfDay }, availableSeats: { $gte: passanger } });
        console.log(rides);
        if (!rides || rides.length === 0) {
            return res.json({ rides: [] });
        }

        return res.json({ rides });
    }
    catch (err) {
        console.log("Error during search:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}