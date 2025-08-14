const express = require("express");
const app = express();
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");
const env = require("dotenv").config();
const mongoose = require("mongoose");
const AuthDb = require("./module/authDb");
const ChatDb = require("./module/chatDb");
const notificationDb = require("./module/notificationDb");

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const userSocketId = {};
app.set("io", io);
app.set("userSocketId", userSocketId);

io.on('connection', (socket) => {
  console.log("New client connected");

  socket.on("register_user", (userId) => {
    userSocketId[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

 socket.on("joinRoom", ({ bookingId, userId }) => {
    socket.join(`booking_${bookingId}`);
    console.log(`User ${userId} joined booking room booking_${bookingId}`);
  });


  socket.on("chatMessage", async ({ bookingId, senderId, receiverId, message }) => {
    try {
      
      const chat = new ChatDb({ bookingId, senderId, receiverId, message });
      await chat.save();

      io.to(`booking_${bookingId}`).emit("message", { senderId, message });

      await notificationDb.create({
        userId: receiverId,
        type: "chat",
        bookingId: bookingId,
        senderId: senderId,
        message: "You have a new chat message."
      });

      console.log("Saving notif =>", { receiverId, bookingId, message });


      const receiverSocketId = userSocketId[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", {
          type: "chat",
          from: senderId,
          message: "New chat message received",
          ride: { _id: bookingId }
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

 socket.on("disconnect", () => {
    for (let userId in userSocketId) {
      if (userSocketId[userId] === socket.id) {
        delete userSocketId[userId];
        break;
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

const rideDb = require("./module/rideInfo");
const bookingDb = require("./module/bookingDb");
const token = require("./middleware/tokenAuth");
// const checkLogin = require("./middleware/checkLogin");
const { promises } = require("dns");

const AuthRoutes = require("./routes/authRouts");
const rideFormRoute = require("./routes/rideForm");
const bookingRideRoute = require("./routes/bookingRide");
const publised = require("./routes/publised");
const profileRoute = require("./routes/profileRoute");
const searchRoute = require("./routes/searchRoute");
const inbox = require("./routes/inboxRoute");
const reqRide = require("./routes/reqRide");
const chattingRoute = require("./routes/chattingRoute");

mongoose.connect("mongodb://127.0.0.1:27017/authDb", {
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Connection Error", err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(token);

// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });

app.use("/", AuthRoutes);
app.use("/", rideFormRoute);
app.use("/", bookingRideRoute);
app.use("/", publised);
app.use("/", profileRoute);
app.use("/", searchRoute);
app.use("/", inbox);
app.use("/", reqRide);
app.use("/", chattingRoute);

http.listen(3300, () => {
  console.log("server running at http://localhost:3300");
})