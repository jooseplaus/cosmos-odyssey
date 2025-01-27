import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const BREAKPOINTS = {
    mobile: '571px',
    tablet: '768px',
    desktop: '1024px'
  };

const SelectContainer = styled.div`
  position: relative;
  width: auto;
  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: auto;
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const Label = styled.div`
  font-size: 0.9em;
  color: #333;
  margin-bottom: 8px;
`;

const SelectButton = styled.div`
  padding: 12px 16px;
  background: white;
  border: 2px solid #e1e5ee;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;


  &:hover {
    border-color: #0052cc;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: auto;
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

const OptionText = styled.div`
  font-weight: 500;
  color: #172b4d;
`;

const ArrowIcon = styled.div`
  color: #5e6c84;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Komponent, mis kuvab valikukasti
const FilterSelect = ({ onChange, options, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const containerRef = useRef(null);

  // Funktsioon, mis sulgeb valikukasti, kui kasutaja klikib mõnele muule elemendile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Lisab event listeneri, mis käivitab handleClickOutside funktsiooni, kui kasutaja klikib mõnele muule elemendile
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Funktsioon, mis valib valiku ja käivitab onChange funktsiooni
  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  // Komponent, mis kuvab valikukasti
  return (
    <SelectContainer ref={containerRef}>
      <Label>{label}</Label>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        <OptionText>
          {selectedOption || placeholder}
        </OptionText>
        <ArrowIcon>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </ArrowIcon>
      </SelectButton>

      {isOpen && (
        <DropdownList>
          {options.map((option, index) => (
            <Option 
              key={index} 
              onClick={() => handleSelect(option)}
            >
              <OptionText>{option}</OptionText>
            </Option>
          ))}
        </DropdownList>
      )}
    </SelectContainer>
  );
};

export default FilterSelect;
