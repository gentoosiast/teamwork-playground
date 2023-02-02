import React, {  useEffect, useState } from 'react';
import Timer from './timer';
import subTitle from '../styledComponents/subTitle'
import styled from 'styled-components';
import { fontSize } from '../../styleConst';

interface ITimer{
    count: number;
    endTimer: ()=>void;
    startTimer?:Boolean
}
const TimerStyled = styled.p`
    font-size: ${fontSize.fontSmall[1080]};
    height: 25px;
`

const TimerComponent = ({count,endTimer, startTimer}:ITimer)=>{
    const [time, setTime] = useState(count);
    const [timeView, setTimeView] = useState('');
    const [timer] = useState(new Timer(1000, count, ()=>{
        setTime(st=>st-1);
        console.log('timer');
    },
    ()=>{
        endTimer();
        
    }));

    useEffect(()=>{
        if(startTimer){
            setTime(count)
            timer.startTimer();
        } else{
            setTime(0);
            timer.stopTimer();
        }
    },[startTimer])

    // startTimer = ()=>{
    //     timer.startTimer()
    // }
    
    useEffect(()=>{
      //timer.startTimer();
      return ()=>timer.stopTimer();
    },[])

    useEffect(()=>{
        // if(time<=0){
        //     endTimer();
        //     timer.stopTimer();
        // }
        setTimeView(()=>{
            if(time===0){
                return '';
            }
            if(time>9){
                return `Time: 00:${time}`
            }
            return `Time: 00:0${time}`
        })
    },[time]);

    return(<>
        <TimerStyled>{timeView}</TimerStyled>
    </>)
}

export default TimerComponent;