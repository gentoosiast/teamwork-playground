import React from "react";
import styled from "styled-components";

interface IBackGround{
    children:JSX.Element
}
const Video = styled.video`
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;    
    background: rgba(0, 0, 0, 0.5);
`
const Content = styled.div`
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    min-height: 100%; 
`

const BackGround=({children}:IBackGround)=>{
  
    return (<>
        <Video loop id="myVideo" autoPlay muted>
            <source src="../../assets/mp4/bg3.mp4" type="video/mp4"/>
        </Video>
        <Content>
               {children}
        </Content>
 
    </>)
}

export default BackGround;