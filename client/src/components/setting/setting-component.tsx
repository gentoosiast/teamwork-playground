import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sound from '../../utils/sound';
import { ISetting } from '../../dto';
import SubTitle from '../styledComponents/subTitle';
import CheckInput from './checkInput';
import RangeInput from './rangeInput';
import ImageIcon from './imageIcon'

interface ISettingComponent{
    type: 'sound'|'music';
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


const SettingComponent = ({type}:ISettingComponent) => {
    const [setting, setState] = useState<ISetting>(Object.assign(Sound.getSetting(type)));

    useEffect(()=>{
        Sound.updateSetting(type, setting);
    },[setting])

    return(<Wrapper>
        <ImageIcon type={type} isSound={setting.isSound} />
        <SubTitle>{type}</SubTitle>
        <CheckInput 
            isSound={setting.isSound} 
            type={type}
            handleChange={e=>setState({...setting, isSound:  e.target.checked})}/>
        <RangeInput 
            volume={setting.volume} 
            handleChange={e=>setState({...setting, volume: +e.target.value})}/>
    </Wrapper>)
}

export default SettingComponent;