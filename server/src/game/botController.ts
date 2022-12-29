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
    nextRound(): void {
      console.log(this.action)
      if(this.action.status ==='shot'){       
        const possiblePositions:IVector[]= [];
        const height = this.enemyField.length;
        const width =  this.enemyField[0].length; 
        this.action.killed.forEach(item=>{
          for(let i=-1; i<2;i++){
            for(let j=-1; j<2; j++){
              if(item.x+i>0
                &&item.x+i<height
                &&item.y+j>0
                &&item.y+j<width
                &&this.checkEmpty({x:item.x+i,y:item.y+j})){
                  possiblePositions.push({x:item.x+i, y:item.y+j });
                }
            }
          }
        }) 
        console.log('possiblePositions',possiblePositions)
        if(possiblePositions.length){
          this.attack(possiblePositions[Math.floor(Math.random()*possiblePositions.length)])
        }
       
        return;
      }
        const x = Math.floor(Math.random()*9);
        const y = Math.floor(Math.random()*9) ;
        this.attack({x,y})

       
    }

    attack(position: IVector){
        if(!this.checkEmpty(position)){
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
            this.action.status = 'shot';
            this.action.killed.push(position)
            this.changeField(position, 'shot');
            this.sendMessage(position, 'shot');
          } else{
            this.action.status = '';
            this.action.killed=[]
            this.killShip(ship);  
          }
          this.nextRound();
      }      
    
}