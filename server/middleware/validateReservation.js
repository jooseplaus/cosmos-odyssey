const PriceList = require('../models/PriceList');

const validateReservation = async (req, res, next) => {
    try {
        const { firstName, lastName, priceListId, routes } = req.body;

        // Kontrollib, kas kõik väljad on täidetud
        if (!firstName || !lastName || !priceListId || !routes) {
            return res.status(400).json({ error: 'Kõik väljad on kohustuslikud' });
        }

        // Leiab viimased 15 hinnakirjad
        const latestPriceLists = await PriceList.find()
            .sort({ validUntil: -1 })
            .limit(15);

        // Kontrollib, kas praegune hinnakiri on viimaste 15 hulgas
        const isPriceListValid = latestPriceLists.some(pl => pl.id === priceListId);
        if (!isPriceListValid) {
            return res.status(400).json({ 
                error: 'See hinnakiri ei ole enam kehtiv (pole viimase 15 hulgas)' 
            });
        }

        // Kontrollib, kas hinnakiri on olemas ja pole aegunud
        const priceList = await PriceList.findOne({ id: priceListId });
        if (!priceList) {
            return res.status(404).json({ error: 'Hinnakirja ei leitud' });
        }

        // Kontrollib, kas hinnakiri on veel kehtiv
        if (new Date(priceList.validUntil) < new Date()) {
            return res.status(400).json({ error: 'Hinnakiri on aegunud' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = validateReservation; 