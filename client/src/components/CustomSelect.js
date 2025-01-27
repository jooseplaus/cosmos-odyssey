import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;

`;

const SelectButton = styled.div`
  padding: 15px;
  background: white;
  border: 2px solid #e1e5ee;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    border-color: #0052cc;
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const Option = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f6f8fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LocationIcon = styled.div`
  margin-right: 12px;
  color: #5e6c84;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const LocationName = styled.div`
  font-weight: 500;
  color: #172b4d;
`;

const LocationDetails = styled.div`
  font-size: 12px;
  color: #5e6c84;
`;

// Komponent, mis kuvab valikukasti
const CustomSelect = ({ onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Funktsioon, mis sulgeb valikukasti, kui kasutaja klikib mõnele muule elemendile
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange({ target: { value: option.name } });
    setIsOpen(false);
  };

  // Komponent, mis kuvab valikukasti
  return (
    <SelectContainer ref={containerRef}>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? (
          <LocationInfo>
            <LocationName>{selectedOption.name}</LocationName>
          </LocationInfo>
        ) : (
          <LocationName>{placeholder}</LocationName>
        )}
        <LocationIcon>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </LocationIcon>
      </SelectButton>

      {isOpen && (
        <DropdownList>
          {options.map((option) => (
            <Option 
              key={option.name}
              onClick={() => handleSelect(option)}
            >
              <LocationIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
              </LocationIcon>
              <LocationInfo>
                <LocationName>{option.name}</LocationName>
                {option.id && (
                  <LocationDetails>
                    Planet ID: {option.id}
                  </LocationDetails>
                )}
              </LocationInfo>
            </Option>
          ))}
        </DropdownList>
      )}
    </SelectContainer>
  );
};

export default CustomSelect;
