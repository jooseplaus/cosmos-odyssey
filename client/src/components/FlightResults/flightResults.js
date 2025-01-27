import React, { useState } from 'react';
import usePriceList from '../../functions/pricelist/usePriceList';
import { priceListApi } from '../../api/priceListApi';
import ExpandResults from './expand-results';
import { getUniqueProviders, filterByProvider } from '../Filters/providerFilter';
import ProviderFilter from '../Filters/providerFilter';
import { filterByPrice, PRICE_SORT } from '../Filters/priceFilter';
import PriceFilter from '../Filters/priceFilter';
import DistanceFilter from '../Filters/distanceFilter';
import { filterByDistance, DISTANCE_SORT } from '../Filters/distanceFilter';
import { filterByTravelTime, TRAVEL_TIME_SORT } from '../Filters/travelTimeFilter';
import TravelTimeFilter from '../Filters/travelTimeFilter';
import {
    ResultsContainer,
    ResultCard,
    RouteInfo,
    PriceInfo,
    NoResults,
    ExpandedSection,
    InfoCards,
    ExpandButton,
    FilterContainer,
    FilterToggleButton,
    LoadingMessage,
    ErrorMessage
} from './flightResultsStyles';
import ReservationForm from '../Reservations/reservationForm';
import { ReservationProvider } from '../Reservations/reservationContext';

function FlightResults({ startLocation, endLocation }) {
    const { priceList, loading, error } = usePriceList();
    const [routes, setRoutes] = React.useState([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchError, setSearchError] = React.useState(null);
    const [selectedRoute, setSelectedRoute] = React.useState(null);
    const [selectedProvider, setSelectedProvider] = React.useState('all');
    const [priceSort, setPriceSort] = React.useState(PRICE_SORT.DEFAULT);
    const [distanceSort, setDistanceSort] = React.useState(DISTANCE_SORT.DEFAULT);
    const [travelTimeSort, setTravelTimeSort] = React.useState(TRAVEL_TIME_SORT.DEFAULT);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Komponenti käivitab, kui startLocation või endLocation valitakse või muudetakse (leitakse uued teed)
    React.useEffect(() => {
        const fetchRoutes = async () => {
            if (!startLocation || !endLocation || !priceList) return;
            
            setSearchLoading(true);
            try {
                // Log päring
                console.log('Sending request with:', {
                    priceListId: priceList.id,
                    startLocation,
                    endLocation
                });

                const response = await priceListApi.findRoutes({
                    priceListId: priceList.id,
                    startLocation,
                    endLocation
                });
                console.log('Response:', response.data);
                setRoutes(response.data);
                setSearchError(null);
            } catch (err) {
                console.error('Error details:', err.response?.data || err.message);
                setSearchError('Viga marsruutide otsimisel: ' + (err.response?.data?.error || err.message));
                setRoutes([]);
            } finally {
                setSearchLoading(false);
            }
        };

        fetchRoutes();
    }, [startLocation, endLocation, priceList]);

    // Filtreerimise ja sorteerimise loogika
    const filteredAndSortedRoutes = React.useMemo(() => {
        let result = [...routes];

        // Filtreeri lennufirma järgi
        if (selectedProvider !== 'all') {
            result = filterByProvider(result, selectedProvider);
        }

        // Sorteeri distantsi järgi
        if (distanceSort !== DISTANCE_SORT.DEFAULT) {
            result = filterByDistance(result, distanceSort);
        }

        // Sorteeri hinna järgi
        result = filterByPrice(result, priceSort);

        // Sorteeri aja järgi
        result = filterByTravelTime(result, travelTimeSort);

        return result;
    }, [routes, selectedProvider, distanceSort, priceSort, travelTimeSort]);

  
    // Funktsioon, reservatsiooni vormi kuvamiseks
    const handleBooking = (route) => {
        setSelectedRoute(route);
        setShowReservationForm(true);
    };

    // Funktsioon, reservatsiooni vormi sulgemiseks
    const handleCloseReservation = () => {
        setShowReservationForm(false);
        setSelectedRoute(null);
    };

    // Funktsioon, filtrite näitamiseks/peitamiseks (mobiilis)
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (loading || searchLoading) {
        return <LoadingMessage>Finding routes...</LoadingMessage>;
    }

    if (error || searchError) {
        return <ErrorMessage>Error: {error || searchError}</ErrorMessage>;
    }

    // Kui ei leitud ühtegi teed, kuvatakse see teade
    if (routes.length === 0) {
        return (
            <ResultsContainer>
                <NoResults>
                    No routes found from {startLocation} to {endLocation}
                </NoResults>
            </ResultsContainer>
        );
    }

    // Kuupäeva vormindus 
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // 24-tunni formaat
            }).replace(',', ''); // Eemaldab koma kuupäeva ja kellaaja vahelt
        } catch (err) {
            console.error('Date formatting error:', err);
            return 'Invalid date';
        }
    };

    // Distantsi vormindus
    const formatDistance = (distance) => {
        if (!distance && distance !== 0) return 'Distance not available';
        
        if (distance >= 1000000) {
            return `${(distance / 1000000).toFixed(1)} million km`;
        } else if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} thousand km`;
        } else {
            return `${distance.toFixed(1)} km`;
        }
    };


    // Filtreerimiste konfiguratsioon
    const filterConfig = [
        {
            Component: ProviderFilter,
            props: {
                providers: getUniqueProviders(routes),
                selectedProvider,
                onChange: setSelectedProvider,
                label: "Filter By Provider"
            }
        },
        {
            Component: PriceFilter,
            props: {
                sortOrder: priceSort,
                onSortChange: setPriceSort,
                label: "Sort By Price"
            }
        },
        {
            Component: DistanceFilter,
            props: {
                sortOrder: distanceSort,
                onSortChange: setDistanceSort,
                label: "Sort By Distance"
            }
        },
        {
            Component: TravelTimeFilter,
            props: {
                sortOrder: travelTimeSort,
                onSortChange: setTravelTimeSort,
                label: "Sort By Flight Duration"
            }
        }
    ];

    return (
        <ReservationProvider>
            <FilterToggleButton onClick={toggleFilters}> 
                {showFilters ? 'Hide Filters' : 'Show Filters'}
            </FilterToggleButton>
            
            <FilterContainer showFilters={showFilters}>
                {filterConfig.map(({ Component, props }, index) => (
                    <Component key={index} {...props} />
                ))}
            </FilterContainer>
            
            <ResultsContainer>
                {showReservationForm && selectedRoute && (
                    <ReservationForm 
                        selectedRoute={selectedRoute}
                        onClose={handleCloseReservation}
                    />
                )}
                
                {filteredAndSortedRoutes.map((route, index) => (
                    <ResultCard key={`${route.company}-${index}`}>
                        <InfoCards>
                            <RouteInfo>
                                <h3>{route.route}</h3>
                                <p>Company: {route.company}</p>
                                <p>Duration: {route.totalDuration.days > 0 ? `${route.totalDuration.days} days ` : ''}
                                    {route.totalDuration.hours > 0 ? `${route.totalDuration.hours} hours ` : ''}
                                    {`${route.totalDuration.minutes} minutes`}</p>
                                <p>Start: {formatDate(route.flights[0].flightStart)}</p>
                                <p>End: {formatDate(route.flights[route.flights.length - 1].flightEnd)}</p>
                                <p>Distance: {formatDistance(route.totalDistance)}</p>
                                <p>Price: {route.totalPrice.toFixed(2)} €</p>
                                <ExpandButton onClick={() => setSelectedRoute(
                                    selectedRoute?.company === route.company ? null : route
                                )}>
                                    {selectedRoute?.company === route.company ? 'Show Less' : 'Show More'}
                                </ExpandButton>
                            </RouteInfo>
                            <PriceInfo>
                                <h4>Price: {route.totalPrice.toFixed(2)} €</h4>
                                <button onClick={() => handleBooking(route)}>
                                    Book Flight
                                </button>
                            </PriceInfo>
                        </InfoCards>
                        
                        {selectedRoute?.company === route.company && (
                            <ExpandedSection>
                                <ExpandResults route={selectedRoute} />
                            </ExpandedSection>
                        )}
                    </ResultCard>
                ))}
            </ResultsContainer>
        </ReservationProvider>
    );
}

export default FlightResults;
