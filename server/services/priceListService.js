const axios = require('axios');
const PriceList = require('../models/PriceList');
const Reservation = require('../models/Reservation');

class PriceListService {
    static async fetchAndUpdatePriceList() {
        try {
            // Laeb uue hinnakirja
            const response = await axios.get('https://cosmosodyssey.azurewebsites.net/api/v1.0/TravelPrices');
            const newPriceList = response.data;

            // Salvestab andmebaasi
            const savedPriceList = await PriceList.create(newPriceList);

            // Kustutab vanemaid hinnakirju, kui on rohkem kui 15
            await PriceList.keepLast15();

            // Kustutab vanemaid reservatsioone, kui on rohkem kui 15
            const validPriceLists = await PriceList.find().select('id');
            const validPriceListIds = validPriceLists.map(pl => pl.id);
            await Reservation.deleteMany({
                priceListId: { $nin: validPriceListIds }
            });

            return savedPriceList;
        } catch (error) {
            console.error('Error updating pricelist:', error);
            throw error;
        }
    }

    static async checkAndUpdatePriceList() {
        const latestPriceList = await PriceList.findOne().sort({ validUntil: -1 });
        
        if (!latestPriceList || new Date(latestPriceList.validUntil) < new Date()) {
            return await this.fetchAndUpdatePriceList();
        }
        
        return latestPriceList;
    }
}

module.exports = PriceListService; 