import React from 'react';
import FilterSelect from '../FilterSelect';

// Funktsioonid lennufirmade filtreerimiseks
export const getUniqueProviders = (routes) => {
    if (!routes || routes.length === 0) return [];
    
    const providers = new Set(routes.map(route => route.company));
    return Array.from(providers);
};

// Filtreeri routid lennufirmade põhjal
export const filterByProvider = (routes, selectedProvider) => {
    if (!selectedProvider || selectedProvider === 'All') {
        return routes;
    }
    
    return routes.filter(route => route.company === selectedProvider);
};

// UI Komponent, mis kuvab lennufirmade filtri
const ProviderFilter = ({ providers, selectedProvider, onChange, label }) => {
    return (
        <FilterSelect
            value={selectedProvider}
            onChange={(value) => onChange(value)}
            options={['All', ...providers]}
            placeholder={label}
            label="Filter By Provider"
        />
    );
};

export default ProviderFilter; 