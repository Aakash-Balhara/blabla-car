const AuthDb = require("../module/authDb");
const rideDb = require("../module/rideInfo");


exports.profile=async (req, res) => {
    const loggedinId = req.user.id;
    const userData = await AuthDb.findById(loggedinId);

    res.status(200).render("profile", { userData });
}

