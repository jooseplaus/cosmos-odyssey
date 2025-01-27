import styled from 'styled-components';

const BREAKPOINTS = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
};

export const ResultsContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
`;
export const Filter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const ResultCard = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
`;

export const RouteInfo = styled.div`
    width: 100%;

    h3 {
        margin: 0 0 12px 0;
        color: #333;
    }

    p {
        margin: 4px 0;
        color: #666;
    }

    button {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.2s ease-in-out;

        &:hover {
            background: #5a6268;
            transform: translateY(-1px);
        }

        &:active {
            transform: translateY(0);
        }
    }
`;

export const PriceInfo = styled.div`
    text-align: right;
    width: 100%;

    h4 {
        margin: 0 0 12px 0;
        color: #007bff;
        font-size: 1.2em;
    }

    button {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;

        &:hover {
            background: #0056b3;
        }
    }
`;

export const NoResults = styled.div`
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 1.1em;
`;

export const ExpandedSection = styled.div`
    width: 100%;
    border-radius: 8px;
`;

export const InfoCards = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;

    @media (max-width: ${BREAKPOINTS.tablet}) {
        flex-direction: column;
        gap: 20px;
    }

`;

export const ExpandButton = styled.button`
    background: #6c757d;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.2s ease-in-out;
    font-weight: 500;

    &:hover {
        background: #5a6268;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    &:active {
        transform: translateY(0);
        box-shadow: none;
    }
`;

export const FilterToggleButton = styled.button`
    display: none; // Peidame desktop vaates
    
    @media (max-width: ${BREAKPOINTS.tablet}) {
        display: block;
        margin: 10px auto;
        padding: 10px 20px;
        background: #0052cc;
        color: white;
        border: none;
        width: 90%;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 500;
        &:hover {
            background: #0747a6;
        }
    }
`;

export const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 1.2rem;
    color: #666;
`;

export const ErrorMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #ff5630;
    font-size: 1.2rem;
    text-align: center;
    padding: 20px;
    background: #fff3f0;
    border-radius: 8px;
    margin: 20px auto;
    max-width: 600px;
`;

export const FilterContainer = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;

    @media (max-width: ${BREAKPOINTS.tablet}) {
        display: ${({ showFilters }) => showFilters ? 'flex' : 'none'};
        flex-direction: column;
        padding: 10px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: absolute;
        z-index: 100;
        width: 90%;
        left: 50%;
        transform: translateX(-50%);
    }    
`;
