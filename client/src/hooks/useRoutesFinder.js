import { useState, useEffect } from 'react';
import usePriceList from '../functions/pricelist/usePriceList';

// Hook, mis leiab teed
const useRoutesFinder = (start, end, sortBy = 'price') => {
    const { routes, loading: priceListLoading, error: priceListError } = usePriceList();
    const [foundRoutes, setFoundRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Käivitab funktsiooni, kui komponent laaditakse
    useEffect(() => {
        const findRoutes = async () => {
            if (priceListLoading || !routes.length) return;
            
            try {
                const response = await fetch('/api/find-routes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ routes, start, end, sortBy }),
                });
                
                const data = await response.json();
                setFoundRoutes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        findRoutes();
    }, [routes, start, end, sortBy, priceListLoading]);

    return { 
        routes: foundRoutes, 
        loading: loading || priceListLoading, 
        error: error || priceListError 
    };
};

export default useRoutesFinder; 