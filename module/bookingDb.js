const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rideDb",
  },
  bookedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authDb",
  },

  bookedFor: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    }
  },
  passengers: Number,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  ratingStat: {
    type: String, default: "Not allowed"
  },

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("bookingDb", bookingSchema);
