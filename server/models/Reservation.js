const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  priceListId: {
    type: String,
    required: true
  },
  routes: [{
    from: String,
    to: String,
    company: String,
    price: Number,
    flightStart: Date,
    flightEnd: Date
  }],
  totalPrice: Number,
  totalTravelTime: Number,
  companies: [String]
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema); 