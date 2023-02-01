import React from 'react';
import sound from '../../assets/svg/sound.svg';
import music from '../../assets/svg/music.svg';
import styled from 'styled-components';
interface IImageIcon{
    type: 'music'|'sound';
    isSound: boolean;
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
    }
`;

const Image = styled.img`
    width: 50px;
    height: auto;
    display: block;
`;

const ImageIcon = ({type, isSound}:IImageIcon)=>{
    const src = type==='music'?music:sound;
    return(
    <WrapperImage isSound={isSound}>
        <Image src={src} alt='icon' />
    </WrapperImage>
    );
}

export default ImageIcon;