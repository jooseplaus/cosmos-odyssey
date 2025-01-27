import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';


const HeaderFooterContainer = styled.div`
    display: flex;
    background-color: #0052cc;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`
const Logo = styled.div`
   padding: 10px;
`

// Komponent, mis kuvab headeri ja footeri
function HeaderFooter() {
    return (
        <HeaderFooterContainer>
            <Logo>
                <img src={logo}/>
            </Logo>
        </HeaderFooterContainer>
    )
}

export default HeaderFooter;