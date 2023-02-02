import React, {  useEffect, useState } from 'react';
import Timer from './timer';

interface ITimer{
    count: number;
    endTimer: ()=>void;
    startTimer?:()=>void;
}

const TimerComponent = ({count,endTimer, startTimer}:ITimer)=>{
    const [time, setTime] = useState(count);
    const [timeView, setTimeView] = useState('');
    const [timer] = useState(new Timer(1000, count, ()=>{
        setTime(st=>st-1);
        console.log('timer');
    },endTimer));
    
    // startTimer = ()=>{
    //     timer.startTimer()
    // }
    
    useEffect(()=>{
      timer.startTimer();
      return ()=>timer.stopTimer();
    },[])

    useEffect(()=>{
        // if(time<=0){
        //     endTimer();
        //     timer.stopTimer();
        // }
        setTimeView(()=>{
            if(time>9){
                return `00:${time}`
            }
            return `00:0${time}`
        })
    },[time]);

    return(<>
        <p>Time: {timeView} </p>
    </>)
}

export default TimerComponent;