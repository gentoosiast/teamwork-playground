import React from 'react';
import styled from 'styled-components';
import { generalColor } from '../../styleConst'

interface IRangeInput{
    volume:number;
    handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
};

interface IRangeInputComponent{
    value: number;
}

const RangeInputComponent = styled.input<IRangeInputComponent>`
    -webkit-appearance: none; 
    margin: 15px 0;
    height: 15px;
    width: 100%;
    background: linear-gradient(to right, ${generalColor} 0%, ${generalColor} ${(props)=>props.value*100}%, rgb(247,247,247)  ${(props)=>props.value*100}%, rgb(247,247,247) 100%);
    border-radius: 10px;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 30px;
        width: 30px;
        background: ${generalColor};
        border-radius: 100%;
    }
`;

const RangeInput = ({ volume, handleChange}:IRangeInput)=>{
    return(<>
         <RangeInputComponent type='range' 
            min='0' 
            max='1' 
            step='0.1'
            value={volume} 
            onChange={handleChange}/>
        </>
       
    )
}

export default RangeInput;