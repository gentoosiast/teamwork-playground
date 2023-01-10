import React from "react";
import styled from "styled-components";
import { fontSize } from '../../styleConst'

const SubTitleComponent= styled.p`
    margin-top: 20px;
    font-size: ${fontSize.fontMiddle[1080]};
    text-align: center;
`
interface ISubTitle{
    children:string;
}
const SubTitle = ({children}:ISubTitle)=>{
    return (<SubTitleComponent>
        {children} 
    </SubTitleComponent>)
}

export default SubTitle;