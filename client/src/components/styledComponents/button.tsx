import React from "react";
import styled from "styled-components";
import { fontSize, generalColor } from '../../styleConst'

const ButtonComponent = styled.button`
    display: block;
    margin: 0 auto;
    margin-top: 50px;
    color: white;  
    background-color:${generalColor};
    font-size: ${fontSize.fontMiddle[1080]};;
    padding: 10px 100px;
    border-radius: 20px;
    border: none;
`
interface IButton{
    children:string;
    onClick:(e: React.MouseEvent<HTMLButtonElement>)=>void;
}
const Button = ({children, onClick}:IButton)=>{
    return (<ButtonComponent type="submit" onClick={onClick}>
        {children} 
    </ButtonComponent>)
}

export default Button;