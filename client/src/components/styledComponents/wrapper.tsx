import React from "react";
import styled from "styled-components";
import {devices} from '../../styleConst';

const WrapperComponent= styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    @media ${devices.laptopWeight} {
        flex-wrap: wrap ;
    }
    @media ${devices.mobileWidht}{
       height: auto;
    }
    @media ${devices.tabletHeight}{
       height: auto;
    }
`;
interface IWrapper{
    children:JSX.Element|JSX.Element[];
}
const Wrapper = ({children}:IWrapper)=>{
    return (<WrapperComponent>
        {children} 
    </WrapperComponent>)
}

export default Wrapper;