import React from "react";
import styled from "styled-components";
import { fontSize } from '../../styleConst'

const TitleComponent = styled.h1`
    font-size: ${fontSize.fontLarge[1080]};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 5px;
`
interface ITitle{
    children:string;
}
const Title = ({children}:ITitle)=>{
    return (<TitleComponent>
        {children} 
    </TitleComponent>)
}

export default Title;