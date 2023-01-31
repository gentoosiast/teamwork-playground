import React from "react";
import styled from "styled-components";
import { backGroundColorOpacity,generalColor } from '../../styleConst'
interface IContentComponent{
    width?: number;
}

const ContentComponent = styled.div<IContentComponent>`
   background-color: ${backGroundColorOpacity};
    padding: 50px;
    border-radius: 10px;
    width:  ${(props)=>props.width?props.width+'px':''};
    border: 1px solid ${generalColor};
`
interface IContent{
    children:JSX.Element|JSX.Element[];
    width?: number;
}
const Content = ({children,width}:IContent)=>{
    return (<ContentComponent width={width}>
        {children} 
    </ContentComponent>)
}

export default Content;