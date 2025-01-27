import React from 'react';
import FilterSelect from '../FilterSelect';

export const DISTANCE_SORT = {
    DEFAULT: 'default',
    HIGH_TO_LOW: 'highToLow',
    LOW_TO_HIGH: 'lowToHigh'
}

// Filtreeri teed kauguse järgi
export const filterByDistance = (routes, sortOrder = DISTANCE_SORT.DEFAULT) => {
    if (!routes || routes.length === 0) return [];
    
    let sortedRoutes = [...routes];

    console.log('Sorting by distance:', {
        sortOrder,
        routesBeforeSort: sortedRoutes.map(r => ({
            route: r.route,
            distance: r.totalDistance
        }))
    });

    switch (sortOrder) {
        case DISTANCE_SORT.HIGH_TO_LOW: // Kaugus kahanevalt
            sortedRoutes.sort((a, b) => {
                if (!a.totalDistance || !b.totalDistance) return 0;
                return b.totalDistance - a.totalDistance;
            });
            break;
        case DISTANCE_SORT.LOW_TO_HIGH: // Kaugus kasvavalt
            sortedRoutes.sort((a, b) => {
                if (!a.totalDistance || !b.totalDistance) return 0;
                return a.totalDistance - b.totalDistance;
            });
            break;
        case DISTANCE_SORT.DEFAULT: // Vaikimisi seadistus
        default:
            return sortedRoutes;
    }

    console.log('After sorting:', {
        sortedRoutes: sortedRoutes.map(r => ({
            route: r.route,
            distance: r.totalDistance
        }))
    });

    return sortedRoutes;
}

// Komponent, mis kuvab kauguse filtri
const DistanceFilter = ({
    sortOrder,
    onSortChange,
    label = "Distance"
}) => {
    const handleChange = (selectedLabel) => {
        const option = options.find(opt => opt.label === selectedLabel);
        if (option) {
            console.log('Distance filter changed:', option.value);
            onSortChange(option.value);
        }
    };
    // Filtri võimalikud valikud
    const options = [
        { value: DISTANCE_SORT.DEFAULT, label: 'Default' },
        { value: DISTANCE_SORT.LOW_TO_HIGH, label: 'Distance Ascending' },
        { value: DISTANCE_SORT.HIGH_TO_LOW, label: 'Distance Descending' }
    ];

    // Praegune valik
    const currentOption = options.find(opt => opt.value === sortOrder)?.label || 'Default';

    return (
        <FilterSelect
            value={currentOption}
            onChange={handleChange}
            options={options.map(opt => opt.label)}
            placeholder={label}
            label="Sort By Distance"
        />
    );
};

export default DistanceFilter;