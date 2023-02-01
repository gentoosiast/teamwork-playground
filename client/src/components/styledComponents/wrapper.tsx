import React from "react";
import styled from "styled-components";

const WrapperComponent= styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
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