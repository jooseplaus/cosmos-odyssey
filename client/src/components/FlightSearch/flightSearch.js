import React, { useState } from 'react';
import usePriceList from '../../functions/pricelist/usePriceList';
import FlightResults from '../FlightResults/flightResults';
import CustomSelect from '../CustomSelect';
import {
  SearchContainer,
  FormGroup,
  Label,
  Button,
  LoadingMessage,
  ErrorMessage,
  InputGroup
} from './flightSearchStyles';

function FlightSearch() {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { priceList, loading, error } = usePriceList();

    if(loading) return <LoadingMessage>Laen tulemusi...</LoadingMessage>;
    if(error) return <ErrorMessage>Viga: {error}</ErrorMessage>;
    if(!priceList) return <LoadingMessage>Andmeid ei leitud...</LoadingMessage>;

    const handleFindRoutes = () => {
        if(!startLocation || !endLocation) {
            alert('Palun vali algus- ja sihtkoht!');
            return;
        }
        setIsSearching(true);
    };

    // Võtame lennufirmad priceList'ist
    const providers = priceList?.companies?.map(company => company.name) || [];

    return (
        <>
            <SearchContainer>
                <InputGroup> 
                    <FormGroup>
                        <Label>Location</Label>
                        <CustomSelect 
                            value={startLocation}
                            onChange={(e) => {
                                setStartLocation(e.target.value);
                                setIsSearching(false);
                            }}
                            options={priceList.locations}
                            placeholder="Choose your location"
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label>Destination</Label>
                        <CustomSelect 
                            value={endLocation}
                            onChange={(e) => {
                                setEndLocation(e.target.value);
                                setIsSearching(false);
                            }}
                            options={priceList.locations}
                            placeholder="Choose your destination"
                        />
                    </FormGroup>
                </InputGroup>
                

                <Button onClick={handleFindRoutes}>
                    Find routes
                </Button>
            </SearchContainer>
            {isSearching && (
                <FlightResults 
                    startLocation={startLocation}
                    endLocation={endLocation}
                />
            )}
        </>
    );
}

export default FlightSearch;