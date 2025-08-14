const express = require("express");
const router=express.Router();
const chatting=require("../controllers/chattingController");

router.get("/chatting/:bookingId/:receiverId", chatting.getchatting);

module.exports=router;