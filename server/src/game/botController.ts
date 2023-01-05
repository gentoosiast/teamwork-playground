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
  chekedShipMatrix = [{x:-1, y: 0},{x:0,y:-1},{x:0,y:1},{x:1,y:0}];

  nextRound(): void {
      console.log(this.action)
      if(this.action.status ==='shot'){       
        const possiblePositions:IVector[]= [];
        const height = this.enemyField.length;
        const width =  this.enemyField[0].length; 
        this.action.killed.forEach(item=>{
          this.chekedShipMatrix.forEach(matrix=>{
            if(item.x+matrix.x>=0
              &&item.x+matrix.x<height
              &&item.y+matrix.y>=0
              &&item.y+matrix.y<width
              &&this.checkEmpty({x:item.x+matrix.x, y:item.y+matrix.y})){
                possiblePositions.push({x:item.x+matrix.x, y:item.y+matrix.y});
              }
          })
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
          if(this.demeges===3){
            this.finishGame(this.id);
          }
      }      
    
}