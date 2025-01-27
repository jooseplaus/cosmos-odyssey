import React from 'react';
import FilterSelect from '../FilterSelect';

export const TRAVEL_TIME_SORT = {
    DEFAULT: 'default',
    HIGH_TO_LOW: 'highToLow',
    LOW_TO_HIGH: 'lowToHigh'
};

// Filtreeri teed lennu pikuste järgi
export const filterByTravelTime = (routes, sortOrder = TRAVEL_TIME_SORT.DEFAULT) => {
    if (!routes || routes.length === 0) return [];

    let sortedRoutes = [...routes];

    const getTotalMinutes = (duration) => {
        return (duration.days * 24 * 60) + (duration.hours * 60) + duration.minutes;
    };

    switch (sortOrder) {
        case TRAVEL_TIME_SORT.HIGH_TO_LOW: // Pikkus kahanevalt
            return sortedRoutes.sort((a, b) => 
                getTotalMinutes(b.totalDuration) - getTotalMinutes(a.totalDuration)
            );
        case TRAVEL_TIME_SORT.LOW_TO_HIGH: // Pikkus kasvavalt
            return sortedRoutes.sort((a, b) => 
                getTotalMinutes(a.totalDuration) - getTotalMinutes(b.totalDuration)
            );
        case TRAVEL_TIME_SORT.DEFAULT: // Vaikimisi järiestus
        default:
            return sortedRoutes;
    }
};

// Komponent, mis kuvab lennu pikkuse filtri
const TravelTimeFilter = ({
    sortOrder,
    onSortChange,
    label = "Flight Duration"
}) => {
    const handleChange = (selectedLabel) => {
        const option = options.find(opt => opt.label === selectedLabel);
        if (option) {
            onSortChange(option.value);
        }
    };

    // Filtri võimalikud valikud
    const options = [
        { value: TRAVEL_TIME_SORT.DEFAULT, label: 'Default' },
        { value: TRAVEL_TIME_SORT.LOW_TO_HIGH, label: 'Flight Duration Ascending' },
        { value: TRAVEL_TIME_SORT.HIGH_TO_LOW, label: 'Flight Duration Descending' }
    ];

    // Praegune valik
    const currentOption = options.find(opt => opt.value === sortOrder)?.label || 'Default';

    return (
        <FilterSelect
            value={currentOption}
            onChange={handleChange}
            options={options.map(opt => opt.label)}
            placeholder={label}
            label="Sort By Flight Duration"
        />
    );
};

export default TravelTimeFilter;