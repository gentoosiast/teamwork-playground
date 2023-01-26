import React, { useState } from "react";
import styled from "styled-components";
import SettingIcon from "../styledComponents/settingIcon";
const Popup = styled.div`
    background-color: red;
    width:300px;
    height: 300px;
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
            <div>
                fjnfjvnfjvnjfvn
            </div>
            <button onClick={closePopup}>Close</button>
            </Popup>
        </BackgroundPopup>
        
    )
    return (<>
        <SettingIcon handleClick={()=>setActive(state=>state=!state)}/>  
        {isActive?content:null}
    </>)
}

export default Setting;