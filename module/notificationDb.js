const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "authDb" },
  type: { type: String, enum: ["ride_response", "chat"], required: true },
  message: String,
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookingDb", default: null },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "authDb" },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("notificationDb", notificationSchema);
