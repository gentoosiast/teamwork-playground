import { IVector, Cell } from "../dto";
import { IPlayerController } from "./IPlayerController";

interface IAction {
  status: string;
  killed: IVector[];
}

export class BotController extends IPlayerController{
  action: IAction = {
    status: "", 
    killed:[]
  }
  chekedShipMatrix:IVector[] = [{x:-1, y: 0},{x:1,y:0},{x:0,y:1},{x:0,y:-1}];

  nextRound(): void {
      if(this.action.status ==='shot'){       
        const possiblePositions:IVector[]= [];
        const height = this.enemyField.length;
        const width =  this.enemyField[0].length; 
        let checkedMatrix:IVector[] = [];
        if(this.action.killed.length<=1){
          checkedMatrix=this.chekedShipMatrix;
        }else{
          const direction = this.action.killed[0].x-this.action.killed[1].x;
          if(direction){
            checkedMatrix=this.chekedShipMatrix.slice(0,2)
          }else{
            checkedMatrix=this.chekedShipMatrix.slice(2)
          }
        }
        this.action.killed.forEach(item=>{
          checkedMatrix.forEach(matrix=>{
            if(item.x+matrix.x>=0
              &&item.x+matrix.x<height
              &&item.y+matrix.y>=0
              &&item.y+matrix.y<width
              &&this.checkEmpty({x:item.x+matrix.x, y:item.y+matrix.y})){
                possiblePositions.push({x:item.x+matrix.x, y:item.y+matrix.y});
              }
          })
        }) 
        if(possiblePositions.length){
          this.attack(possiblePositions[Math.floor(Math.random()*possiblePositions.length)])
        }       
        return;
      }
      this.randomAttack();
    }

    attack(position: IVector){
      setTimeout(()=>{
        const shipIndex = this.shipField[position.y][position.x];
      this.changeField(position);
        if (shipIndex === -1) {
          this.sendMessage(position, 'miss', true);         
          return;
        }     
        const ship =this.ships[shipIndex];
        const isKilled = this.checkShip(ship);
       
        if(!isKilled){
          this.action.status = 'shot';
          this.action.killed.push(position)
          this.changeField(position, 'shot');
          this.sendMessage(position, 'shot');
        } else{
          this.action.status = '';
          this.action.killed=[]
          this.killShip(ship);  
          if(this.demeges===10){
            return;
          }
        }
        this.nextRound();
      },1000)
    }    
    
}