import React from "react";
import styled from "styled-components";
import { fontSize, generalColor } from '../../styleConst'

const InputComponent = styled.input`
    margin:0 auto;
    margin-top: 20px;
    font-size:${fontSize.fontMiddle[1080]};
    padding: 5px 20px;
    border: 1px soled ${generalColor};
    border-radius: 10px;
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