import React from "react";
import styled from 'styled-components';
import setting from '../../public/svg/setting.svg'
import { devices } from "../../styleConst";

interface ISettingIcon{
    handleClick: ()=>void;
}
const Button = styled.button`
    position: absolute;
    top: 30px;
    right: 50px;
    width: 45px;
    height: 45px;
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
        <Image src={setting} alt='icon'/>
    </Button>
    )
}
export default SettingIcon;