import { usePriceList } from '../functions/pricelist/usePriceList';

const PriceListView = () => {
    const { priceList, loading, error } = usePriceList();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!priceList) return <div>No price list available</div>;
    
    return (
        <div>
            <h2>Price List</h2>
            <p>Valid until: {new Date(priceList.validUntil).toLocaleString()}</p>
            
            <h3>Available Locations</h3>
            <ul>
                {priceList.locations.map(location => (
                    <li key={location.id}>{location.name}</li>
                ))}
            </ul>
            
            <h3>Routes</h3>
            <div className="routes-grid">
                {priceList.routes.map(route => (
                    <div key={route.id} className="route-card">
                        <h4>{route.from.name} → {route.to.name}</h4>
                        <p>Distance: {route.distance} km</p>
                        <h5>Providers:</h5>
                        <ul>
                            {route.providers.map(provider => (
                                <li key={provider.id}>
                                    {provider.company}: €{provider.price}
                                    <br />
                                    Duration: {provider.duration} minutes
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriceListView; 