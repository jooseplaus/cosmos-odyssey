import styled from 'styled-components';

const BREAKPOINTS = {
    mobile: '560px',
    tablet: '860px',
    desktop: '1024px'
  };

export const SearchContainer = styled.div`
  width: auto;
  margin: 40px auto;
  gap: 20px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    flex-direction: row;
    width: 100%;
    gap: 10px;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    flex-direction: column;
    width: 100%;
    gap: 10px;
    align-items: start;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
  width: 300px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 100%;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #ffe6e6;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
`;
