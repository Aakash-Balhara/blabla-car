const express = require("express");
const router=express.Router();
const checkLogin = require("../middleware/checkLogin");
const inboxController=require("../controllers/inboxController");
router.use(checkLogin);


router.get("/inbox",inboxController.getInbox);

module.exports=router;