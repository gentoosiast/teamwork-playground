import React, { useState } from "react";
import styled from "styled-components";
import SettingIcon from "./settingIcon";
import SettingComponent from './setting-component';
import {ButtonClose} from '../styledComponents/buttons';
import close from '../../public/svg/close.svg'
import { generalColor,backGroundColor } from "../../styleConst";
const Popup = styled.div`
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 50px;
    border-radius: 10px;
    width: 500px;
    border: 1px solid ${generalColor};
    background-color: ${backGroundColor};
`
 const BackgroundPopup = styled.div`
    position: fixed;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.5);
 `

const CloseImage = styled.img`
    width: 30px;
    height: 30px;
    filter: invert(1);
`
const Setting = ()=>{
    const [isActive, setActive] = useState(false);
    const closePopup = ()=>{
        setActive(false);
    }
    const handlePopup = (e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation();
    }
    const content = (
        <BackgroundPopup onClick={closePopup}>
            <Popup onClick={handlePopup}>
                <SettingComponent type='sound'/>
                <SettingComponent type='music'/>
                <ButtonClose onClick={closePopup}>
                    <CloseImage src={close} alt='close popup'/>
                </ButtonClose>
            </Popup>
        </BackgroundPopup>
        
    )
    return (<>
        <SettingIcon handleClick={()=>setActive(state=>state=!state)}/>  
        {isActive?content:null}
    </>)
}

export default Setting;