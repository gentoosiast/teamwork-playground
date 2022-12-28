import { IPlayerController } from "./IPlayerController";


export class BotController extends IPlayerController{
    nextRound(): void {
        const x = Math.floor(Math.random()*9);
        const y = Math.floor(Math.random()*9) 
        console.log('bot attack', x,y);
        const turn =  this.attack({x,y})
        if(turn==='again'){
            this.nextRound();
        }
       
    }
    
}