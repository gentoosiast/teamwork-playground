export default class Timer {
    func:()=>void;
    timer: NodeJS.Timer;
    time: number;
    count:number;
    endTimer:()=>void;
    size: number;
    constructor(time: number, size:number, func:()=>void, endTimer:()=>void ){       
        this.time = time;
        this.count = size;
        this.size = size;
        this.func = func;
        this.endTimer =endTimer
    } 

    startTimer(){
        this.count = this.size;
        this.timer = setInterval(()=>{
            this.func();
            this.count--;
            if(this.count<=0){
                this.stopTimer();
                this.endTimer()
            }
        },this.time);
    }

    stopTimer(){
        clearInterval(this.timer);
    }
}