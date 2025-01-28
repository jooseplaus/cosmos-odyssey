const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: String,
  from: String,
  to: String,
  company: String,
  startTime: Date,
  endTime: Date,
  distance: Number,
  price: Number
});

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  routes: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  totalDuration: {
    days: Number,
    hours: Number,
    minutes: Number
  },
  companies: [{
    type: String
  }],
  flights: [flightSchema],
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Lisa pre-save hook logimiseks
reservationSchema.pre('save', function(next) {
  console.log('Salvestatavad andmed:', this.toObject());
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation; 