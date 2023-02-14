import React from "react";
import styled from "styled-components";
import { fontSize, generalColor, devices } from '../../styleConst'

const InputComponent = styled.input`
    margin:0 auto;
    margin-top: 20px;
    font-size:${fontSize.fontMiddle[1080]};
    padding: 5px 20px;
    border: 1px soled ${generalColor};
    border-radius: 10px;
    @media ${devices.tabletWidht}{
        width: 300px;
        font-size: ${fontSize.fontMiddle[768]};
    }
    @media ${devices.tabletHeight}{
        width: 300px;
        font-size: ${fontSize.fontMiddle[768]};
    }
    @media ${devices.mobileWidht}{
        width: 200px;
        margin-top: 10px;
        font-size: ${fontSize.fontMiddle[575]};
    }
    @media ${devices.mobileHeight}{
        width: 200px;
        margin-top: 10px;
        font-size: ${fontSize.fontMiddle[575]};
    }

`
interface IInput{
    placeHolder:string;
    value: string;
    handlerChange:(e: React.ChangeEvent<HTMLInputElement>)=>void;
    type?:string;
}
const Input = ({placeHolder,value, handlerChange, type='text'}:IInput)=>{
    return (<InputComponent onChange={handlerChange} placeholder={placeHolder} value={value} type={type}/>)
}

export default Input;