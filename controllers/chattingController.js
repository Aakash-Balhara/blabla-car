const ChatDb = require("../module/chatDb");

exports.getchatting=async (req, res) => {
  const { bookingId, receiverId } = req.params;
  const senderId = req.user.id;

  const chatHistory = await ChatDb.find({
    bookingId,
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  }).sort("timestamp");

  res.render("chatting",{
    bookingId,
    senderId,
    receiverId,
    chatHistory
  });
};
