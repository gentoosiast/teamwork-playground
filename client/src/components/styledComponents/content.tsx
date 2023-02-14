import React from "react";
import styled from "styled-components";
import { backGroundColorOpacity,generalColor,devices } from '../../styleConst'
interface IContentComponent{
    width?: number;
}

const ContentComponent = styled.div<IContentComponent>`
    padding: 50px;
    margin: 20px;
    width:  ${(props)=>props.width?props.width+'px':''};
    border: 1px solid ${generalColor};
    border-radius: 10px;
    background-color: ${backGroundColorOpacity};
    @media ${devices.mobileWidht}{
        padding: 20px;
    }
    @media ${devices.mobileHeight}{
        padding: 20px;
    }
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