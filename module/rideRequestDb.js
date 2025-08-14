const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rideDb",
        required: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthDb",
        required: true
    },
    passengers: {
        type: Number,
        required: true
    },
    bookingType: {
        type: String,
        enum: ["self", "other"],
        required: true
    },
    otherName: String,
    otherEmail: String,
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    requestedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("RideRequest", rideRequestSchema);
