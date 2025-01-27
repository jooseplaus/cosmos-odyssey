import React from 'react';
import FilterSelect from '../FilterSelect';

export const PRICE_SORT = {
    DEFAULT: 'default',
    HIGH_TO_LOW: 'highToLow',
    LOW_TO_HIGH: 'lowToHigh'
};

// Filtreeri teed hinna järgi
export const filterByPrice = (routes, sortOrder = PRICE_SORT.DEFAULT) => {
    if (!routes || routes.length === 0) return [];

    // Teeme koopia, et mitte muuta originaalset arrayd
    let sortedRoutes = [...routes];

    // Sorteerime vastavalt valitud järjestusele
    switch (sortOrder) {
        case PRICE_SORT.HIGH_TO_LOW: // Hinnad kahanevalt
            return sortedRoutes.sort((a, b) => b.totalPrice - a.totalPrice);
        case PRICE_SORT.LOW_TO_HIGH: // Hinna kasvavalt
            return sortedRoutes.sort((a, b) => a.totalPrice - b.totalPrice);
        case PRICE_SORT.DEFAULT: // Vaikimisi järiestus
        default:
            return sortedRoutes;
    }
}

// Komponent, mis kuvab hinna filtri
const PriceFilter = ({ 
    sortOrder,
    onSortChange,
    label = "Price" 
}) => {
    const handleChange = (selectedLabel) => {
        const option = options.find(opt => opt.label === selectedLabel);
        if (option) {
            onSortChange(option.value);
        }
    };

    // Filtri võimalikud valikud
    const options = [
        { value: PRICE_SORT.DEFAULT, label: 'Default' },
        { value: PRICE_SORT.LOW_TO_HIGH, label: 'Price Rising' },
        { value: PRICE_SORT.HIGH_TO_LOW, label: 'Price Falling' }
    ];

    // Praegune valik
    const currentOption = options.find(opt => opt.value === sortOrder)?.label || 'Default';

    return (
        <FilterSelect
            value={currentOption}
            onChange={handleChange}
            options={options.map(opt => opt.label)}
            placeholder={label}
            label="Sort By Price"
        />
    );
};

export default PriceFilter;


