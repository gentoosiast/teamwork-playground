import React from 'react';
import styled from 'styled-components';
import { generalColor } from '../../styleConst';

interface ICheckInput{
    isSound:boolean;
    type: string;
    handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

const Wrapper = styled.label`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 25px;
    height: 25px;
`;

const CheckMark = styled.span`
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    display: block;
    &:hover{
        background-color: #ccc;
    }
`;

const CheckBox = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked + ${CheckMark}{
        background-color: ${generalColor};
        &:after{
            content: "";
            position: absolute;
            left: 9px;
            top: 5px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
    }
`;

const CheckInput = ({isSound, handleChange, type}:ICheckInput)=>{
    return(<Wrapper htmlFor={type}>
        <CheckBox type='checkbox' 
        checked={isSound} 
        onChange={handleChange}
        id={type}/>
        <CheckMark/>
    </Wrapper>)
};

export default CheckInput;