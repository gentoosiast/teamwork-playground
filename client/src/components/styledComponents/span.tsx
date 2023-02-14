import React from "react";
import styled from "styled-components";
import { fontSize, devices } from '../../styleConst'
interface ISubTitleComponent{
    textAlign?: string;
}
const SubTitleComponent= styled.span<ISubTitleComponent>`
    font-size: ${fontSize.fontSmall[1080]};
    text-align: ${(props)=>props.textAlign};
    @media ${devices.tabletWidht}{
        font-size: ${fontSize.fontSmall[768]};
    }
    @media ${devices.tabletHeight}{
        font-size: ${fontSize.fontSmall[768]};
    }
    @media ${devices.mobileHeight}{
        font-size: ${fontSize.fontSmall[575]};
    }
`
interface ISpan{
    children:string|string[];
    textAlign?: string;
}
const Span = ({children,textAlign}:ISpan)=>{
    return (<SubTitleComponent textAlign={textAlign}>
        {children} 
    </SubTitleComponent>)
}

export default Span;