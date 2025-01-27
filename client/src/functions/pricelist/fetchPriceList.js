
// Funktsioon, mis laeb hinna nimekirja
export const fetchPriceList = async () => {
    try {
        const response = await fetch('/api/prices');
        const data = await response.json();
        
        if (!data) {
            throw new Error('Andmete laadimine ebaõnnestus');
        }

        return data;
    } catch (error) {
        console.log('API fetch error:', error.message);
        return { locations: [], routes: [] };
    }
};



export default fetchPriceList;
