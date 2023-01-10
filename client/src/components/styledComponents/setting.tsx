import React from "react";
import styled from 'styled-components';

const Button = styled.button`
    position: absolute;
    top: 30px;
    right: 50px;
    border: none;
    background: none;
`

const Image = styled.img` 
    transition: all 5s;
    &:hover {
        transform: rotate(720deg);
    }
`;

const Setting = ()=>{
    return(<>
    <Button>
        <Image src='../../assets/svg/setting.svg' alt='icons'/>
    </Button>
    </>)
}
export default Setting;