const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
  id: String,
  validUntil: Date,
  legs: [{
    id: String,
    routeInfo: {
      from: {
        id: String,
        name: String
      },
      to: {
        id: String,
        name: String
      },
      distance: Number
    },
    providers: [{
      id: String,
      company: {
        id: String,
        name: String
      },
      price: Number,
      flightStart: Date,
      flightEnd: Date
    }]
  }]
}, { timestamps: true });

// Funktsioon, mis kustutab vanemaid hinnakirju, kui on rohkem kui 15
priceListSchema.statics.keepLast15 = async function() {
  const count = await this.countDocuments();
  if (count > 15) {
    const toDelete = count - 15;
    const oldestPriceLists = await this.find({})
      .sort({ validUntil: 1 })
      .limit(toDelete);
    
    await this.deleteMany({ _id: { $in: oldestPriceLists.map(pl => pl._id) } });
  }
};

module.exports = mongoose.model('PriceList', priceListSchema); 