import React from "react";
import styled from "styled-components";
import { devices, fontSize } from '../../styleConst'

const ErrorComponent= styled.div`
    position: absolute;
    top: -10px;
    left: 10px;
    color:  white;
    background-color: red;
    font-size: ${fontSize.fontSmall[1080]};;
    padding: 5px;
    border-radius: 5px;
    opacity: 0.8;
    &:after {
        content: ''; 
        position: absolute;
        left: 10px; bottom: -15px;
        border: 10px solid transparent;
        border-top: 10px solid red;
    }
    @media ${devices.mobileWidht}{
        top: -20px;
        font-size: ${fontSize.fontSmall[575]};;
    }
    @media ${devices.mobileHeight}{
        top: -20px;
        font-size: ${fontSize.fontSmall[575]};;
    }
`
interface IError{
    children:string;
}
const Error = ({children}:IError)=>{
    return (<ErrorComponent>
        {children} 
    </ErrorComponent>)
}

export default Error;