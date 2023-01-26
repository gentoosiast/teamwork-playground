import React from "react";
import styled from "styled-components";
import { fontSize } from '../../styleConst'
interface ISubTitleComponent{
    textAlign?: string;
}
const SubTitleComponent= styled.span<ISubTitleComponent>`
    font-size: ${fontSize.fontSmall[1080]};
    text-align: ${(props)=>props.textAlign};
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