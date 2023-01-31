import React from "react";
import styled from "styled-components";
import { fontSize, generalColor } from '../../styleConst'
interface IButton{
    children:string|JSX.Element;
    onClick:(e: React.MouseEvent<HTMLButtonElement>)=>void;
}

const BtnComponent = styled.button`
    color: white;  
    background-color:${generalColor};
    border: none;
    transition: all 0.5s;
    &:hover {
        transform: scale(1.1);
    }
`

const BtnGeneralComponent = styled(BtnComponent)`
    display: block;
    margin: 50px auto 0;
    font-size: ${fontSize.fontMiddle[1080]};
    padding: 10px 100px;
    border-radius: 20px;
`


const ButtonGeneral = ({children, onClick}:IButton)=>{
    return (<BtnGeneralComponent type="submit" onClick={onClick}>
        {children} 
    </BtnGeneralComponent>)
}

const BtnRoomsComponent = styled(BtnComponent)`
    font-size: ${fontSize.fontSmall[1080]};
    padding: 10px 50px;
    margin: 10px;
    border-radius: 5px;
`

const ButtonRooms = ({children, onClick}:IButton)=>{
    return (<BtnRoomsComponent type="submit" onClick={onClick}>
        {children} 
    </BtnRoomsComponent>)
}

const ButtonCloseComponent =  styled(BtnComponent)`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
`

const ButtonClose = ({children, onClick}:IButton)=>{
    return (<ButtonCloseComponent type="submit" onClick={onClick}>
        {children} 
    </ButtonCloseComponent>)
}

export { ButtonGeneral, ButtonRooms, ButtonClose };