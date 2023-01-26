import React from "react";
import styled from 'styled-components';

interface ISettingIcon{
    handleClick: ()=>void;
}
const Button = styled.button`
    position: absolute;
    top: 30px;
    right: 50px;
    border: none;
    background: none;
`

const Image = styled.img` 
    transition: all 5s;
    &:hover {
        transform: rotate(720deg);
    }
`;

const SettingIcon = ({handleClick}:ISettingIcon)=>{
    return(
    <Button onClick={handleClick}>
        <Image src='../../assets/svg/setting.svg' alt='icons'/>
    </Button>
    )
}
export default SettingIcon;