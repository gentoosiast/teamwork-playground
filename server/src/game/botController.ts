import { Cell } from "../../../interface/IField";
import { IVector } from "../../../interface/IVector";
import { IPlayerController } from "./IPlayerController";


export class BotController extends IPlayerController{
    nextRound(): void {
        const x = Math.floor(Math.random()*9);
        const y = Math.floor(Math.random()*9) 
        this.attack({x,y})

       
    }
    attack(position: IVector){
        if(this.enemyField[position.y][position.x ] !== Cell.Empty){
            this.nextRound();
            return;
          } 
         const shipIndex = this.shipField[position.y][position.x];
          this.changeField(position);
          if (shipIndex === -1) {
            this.sendMessage(position, 'miss', true);         
            return;
          }       
          const ship =this.ships[shipIndex];
          const isKilled = this.checkShip(ship);
         
          if(!isKilled){
            this.changeField(position, 'shot');
            this.sendMessage(position, 'shot');
          } else{
            this.killShip(ship);  
          }
          this.nextRound();
      }      
    
}