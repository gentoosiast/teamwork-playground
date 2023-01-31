import React, { useEffect, useState } from 'react';
import sound from '../../assets/svg/sound.svg';
import music from '../../assets/svg/music.svg';
import styled from 'styled-components';
import Sound from '../../utils/sound';
import { ISetting } from '../../dto';
import SubTitle from '../styledComponents/subTitle';
interface ISettingComponent{
    type: 'sound'|'music';
}

interface IWrapperImage {
    isSound: boolean;
}

const WrapperImage = styled.div<IWrapperImage>`
    position: relative;
    ${(props)=>props.isSound ? '' :
    `&::before {
        content: ''; 
        position: absolute;
        top: 0;
        left: 0;
        width: 70px;
        height: 5px;
        transform: rotate(45deg);
        transform-origin: top left;
        background-color: #000;
    }`
};
   
`
const Image = styled.img`
    width: 50px;
    height: auto;
    display: block;
`
const CheckInput = styled.input`

`
const RangeInput = styled.input`
`    


const SettingComponent = ({type}:ISettingComponent) => {
    const src = type==='music'?music:sound;
    const [setting, setState] = useState<ISetting>(Object.assign(Sound.getSetting(type)));

    useEffect(()=>{
        Sound.updateSetting(type, setting);
    },[setting])

    return(<>
    <WrapperImage isSound={setting.isSound}>
        <Image src={src} alt='icon' />
        <SubTitle>{type}</SubTitle>
        <CheckInput type='checkbox' 
            checked={setting.isSound} 
            onChange={e=>setState({...setting, isSound:  e.target.checked})}/>
        <RangeInput type='range' 
            min='0' 
            max='1' 
            step='0.1'
            value={setting.volume} 
            onChange={e=>setState({...setting, volume: +e.target.value})}/>
    </WrapperImage>
     
    </>)
}

export default SettingComponent;