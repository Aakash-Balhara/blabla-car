const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
   userId: {
      type: String,
      required: true
   },
   from: {
      type: String,
      required: true
   },
   to: {
      type: String,
      required: true
   },
   pickup:{
      type:String,
      required:true
   },
   drop:{
      type:String,
      required:true
   },
   selectedRoute: {
      index: { 
         type: Number, 
         required: true 
      },
      distance: { 
         type: Number, 
         required: true 
      },
      duration: { 
         type: Number, 
         required: true 
      }
   },
   date: {
      type: Date,
      required: true,
   },
   time: {
      type: String,
      required: true,
   },
   riderName: {
       type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
   },
   availableSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
   },
   price: {
      type: Number,
      required: true,
      min: 0,
   },
   phoneNumber: {
      type: String,
      required: true,
   },
   additionalNotes: {
      type: String,
      trim: true,
      maxlength: 200
   }

}, { timestamps: true })

const rideDb = mongoose.model('rideDb', rideSchema);

module.exports = rideDb;