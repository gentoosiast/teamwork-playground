import React from "react";
import styled from "styled-components";
import { fontSize } from '../../styleConst'
interface ISubTitleComponent{
    textAlign?: string;
}
const SubTitleComponent= styled.p<ISubTitleComponent>`
    font-size: ${fontSize.fontMiddle[1080]};
    text-align: ${(props)=>props.textAlign};
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