import React from "react";
import styled from "styled-components";
import { IErrorType } from "../../dto";
import { devices, fontSize } from '../../styleConst'
interface IErrorComponent{
    type: IErrorType;
}
const ErrorComponent= styled.div<IErrorComponent>`
    position: absolute;
    bottom: ${(props)=>props.type ==='name' ?'170px':'50px'};
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
        bottom: ${(props)=>props.type ==='name' ?'125px':'45px'};
        font-size: ${fontSize.fontSmall[575]};;
    }
    @media ${devices.mobileHeight}{
        bottom: ${(props)=>props.type ==='name' ?'125px':'45px'};
        font-size: ${fontSize.fontSmall[575]};;
    }
`
interface IError{
    children:string;
    type: IErrorType;
}
const Error = ({children, type}:IError)=>{
    return (<ErrorComponent type={type}>
        {children} 
    </ErrorComponent>)
}

export default Error;