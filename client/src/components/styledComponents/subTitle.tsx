import React from "react";
import styled from "styled-components";
import { fontSize, devices } from '../../styleConst'
interface ISubTitleComponent{
    textAlign?: string;
}
const SubTitleComponent= styled.p<ISubTitleComponent>`
    font-size: ${fontSize.fontMiddle[1080]};
    text-align: ${(props)=>props.textAlign};
    @media ${devices.tabletWidht}{
        font-size: ${fontSize.fontMiddle[768]};
    }
    @media ${devices.tabletHeight}{
        font-size: ${fontSize.fontMiddle[768]};
    }
    @media ${devices.mobileWidht}{
        font-size: ${fontSize.fontMiddle[575]};
    }
    @media ${devices.mobileHeight}{
        font-size: ${fontSize.fontMiddle[575]};
    }
`
interface ISubTitle{
    children:string|string[];
    textAlign?: string;
}
const SubTitle = ({children,textAlign}:ISubTitle)=>{
    return (<SubTitleComponent textAlign={textAlign}>
        {children} 
    </SubTitleComponent>)
}

export default SubTitle;