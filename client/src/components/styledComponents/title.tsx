import React from "react";
import styled from "styled-components";
import { fontSize } from '../../styleConst'
interface ITitleComponent{
    textAlign?: string;
}

const TitleComponent = styled.h1<ITitleComponent>`
    margin-bottom:20px;
    font-size: ${fontSize.fontLarge[1080]};
    text-transform: uppercase;
    letter-spacing: 5px;
    text-align: ${(props)=>props.textAlign};
`
interface ITitle{
    children:string|string[];
    textAlign?: string;
}
const Title = ({children,textAlign}:ITitle)=>{
    return (<TitleComponent>
        {children} 
    </TitleComponent>)
}

export default Title;