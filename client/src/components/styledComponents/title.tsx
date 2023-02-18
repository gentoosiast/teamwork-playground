import React from "react";
import styled from "styled-components";
import { fontSize, devices } from '../../styleConst'
interface ITitleComponent{
    textAlign?: string;
}

const TitleComponent = styled.h1<ITitleComponent>`
    margin-bottom:20px;
    font-size: ${fontSize.fontLarge[1080]};
    text-transform: uppercase;
    letter-spacing: 5px;
    text-align: ${(props)=>props.textAlign};
    @media ${devices.tabletWidht}{
        font-size: ${fontSize.fontLarge[768]};
    }
    @media ${devices.tabletHeight}{
        font-size: ${fontSize.fontLarge[768]};
    }
    @media ${devices.mobileWidht}{
        margin-bottom:5px;
        font-size: ${fontSize.fontLarge[575]};
    }
    @media ${devices.mobileHeight}{
        margin-bottom:5px;
        font-size: ${fontSize.fontLarge[575]};
    }
`
interface ITitle{
    children:string|string[];
    textAlign?: string;
}
const Title = ({children,textAlign}:ITitle)=>{
    return (<TitleComponent textAlign={textAlign}>
        {children} 
    </TitleComponent>)
}

export default Title;