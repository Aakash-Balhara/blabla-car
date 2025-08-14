const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "boookingDb" },
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatDb", chatSchema);
