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
          let isKilled = true;
          for (let i = 0; i < ship.length; i += 1) {
              if (ship.direction === 0) {
                if ( this.enemyField[ship.position.y][ship.position.x + i] === Cell.Empty) {
                  isKilled = false;
                  break;
                }
            } else {
                if ( this.enemyField[ship.position.y + i][ship.position.x] === Cell.Empty) {
                    isKilled = false;
                    break;
                }
            }
          }
         
          if(!isKilled){
            this.changeField(position, 'shot');
            this.sendMessage(position, 'shot');
          } else{
            const height = this.enemyField.length;
            const width =  this.enemyField[0].length;
            if (ship.direction === 0){
              for (let i =-1; i < ship.length+1; i += 1){
                for (let j =-1; j < 2; j += 1){
                  if(ship.position.y+j>=0&&ship.position.y+j<height&&ship.position.x + i>=0&&ship.position.x + i<width){
                     this.changeField({y: ship.position.y+j, x:ship.position.x + i}, 'miss');
                    this.sendMessage({y: ship.position.y+j, x:ship.position.x + i}, 'miss');
                  }                
                }             
              }
              for (let i = 0; i < ship.length; i += 1){
                this.changeField({y: ship.position.y, x:ship.position.x + i}, 'killed');
                this.sendMessage({y: ship.position.y, x:ship.position.x + i}, 'killed');
              }
            } else {
              for (let i =-1; i < ship.length+1; i += 1){
                for (let j =-1; j < 2; j += 1){
                  if(ship.position.y+i>=0&&ship.position.y+i<height&&ship.position.x + j>=0&&ship.position.x + j<width){
                    this.changeField({y: ship.position.y+i, x:ship.position.x + j}, 'miss');
                    this.sendMessage({y: ship.position.y+i, x:ship.position.x + j}, 'miss');
                  }            
                }             
              }
              for (let i = 0; i < ship.length; i += 1){
                this.changeField({y: ship.position.y+i, x:ship.position.x }, 'killed');
                this.sendMessage({y: ship.position.y+i, x:ship.position.x}, 'killed');
              }
            }
  
          }
          this.nextRound();
      }      
    
}