const express = require("express");
const router=express.Router();
const rideDb = require("../module/rideInfo");
const checkLogin = require("../middleware/checkLogin");
const searchController=require("../controllers/searchController");
router.use(checkLogin);

router.get("/search",searchController.getSearch );

router.post("/search", searchController.search);

module.exports=router;