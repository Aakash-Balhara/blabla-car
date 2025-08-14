const rideRequestDb = require("../module/rideRequestDb");
const notificationDb = require("../module/notificationDb");
const mongoose = require("mongoose");

exports.getInbox = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const rideRequests = await rideRequestDb.find({
      requestedBy: userId,
      status: { $in: ["accepted", "rejected"] }
    }).populate("rideId");

    const requestNotifications = rideRequests.map(req => ({
      _id: req._id,
      type: "ride_response",
      status: req.status,
      ride: req.rideId,
      message: `Your request for ride ${req.rideId?.from} → ${req.rideId?.to} was ${req.status.toUpperCase()}`,
      isRead: false,
      timestamp: req.updatedAt || new Date()
    }));

    const chatNotifications = await notificationDb.find({
      userId: new mongoose.Types.ObjectId(userId),
      type: "chat"
    }).populate({
      path: "bookingId",
      populate: { path: "rideId" }
    });

    //  console.log("chatNotifications",chatNotifications);

    //  console.log("UserId in request:", userId, typeof userId);
    // const allNotifs = await notificationDb.find();
    // console.log("All notifications in DB:", allNotifs);



    const chatFormatted = chatNotifications.map(notif => ({
      _id: notif._id,
      type: "chat",
      status: "chat",
      ride: notif.bookingId?.rideId,
      message: notif.message,
      isRead: notif.isRead,
      bookingId: notif.bookingId?._id,
      receiverId: notif.senderId,
      timestamp: notif.timestamp
    }));
    //  console.log("chatFormatted",chatFormatted);

    const notifications = [...requestNotifications, ...chatFormatted].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    // console.log("notifications",notifications);

    res.render("inbox", { notifications, user: req.user });
  } catch (err) {
    console.error("Inbox error:", err);
    res.status(500).send("Something went wrong");
  }
}