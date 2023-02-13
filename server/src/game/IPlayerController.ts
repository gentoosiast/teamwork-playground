import { emptyState } from "../utils/fieldGenerator";
import { IShip, IVector, Cell } from "../dto";

export class IPlayerController{
    id: number;
    ships: IShip[] = [];
    shipField:Array<Array<number>> =[]
    field: Array<Array<Cell>> = emptyState();
    enemyField: Array<Array<Cell>> = emptyState();
    demeges = 0;
    sendMessage: (position: IVector,status: string, isChangeCurrent?: boolean)=>void;
    finishGame: (winPlayer: number)=>void;
    ourShips: IShip[]=[];
   
    constructor(id: number, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void, finishGame:(winPlayer:number)=>void){
        this.id = id;
       // this.shipField=new Array(10).fill(new Array(10).fill(0))
        this.sendMessage = (position,status, isChangeCurrent=false)=>{
            sendMessage(position,status,isChangeCurrent)
        }
        this.finishGame = (winPlayer:number)=>{
          finishGame(winPlayer)
        }
    }
    startGame(){}
    nextRound(){}

    addOurShips(ships: IShip[]){
        this.ourShips = ships;
    }

    addEnemyShips(ships: IShip[]){
      if(!this.shipField || !ships)return
        this.ships = ships;

        for (let i = 0; i < 10; i += 1) {
         const row = [];
         for (let j = 0; j < 10; j += 1) {
           row.push(-1);
         }
         this.shipField.push(row); 
       }
       ships.forEach((ship, idx) => {
         for (let i = 0; i < ship.length; i += 1) {
           if (!ship.direction) {
             this.shipField[ship.position.y][ship.position.x + i] = idx;
           } else {
             this.shipField[ship.position.y + i][ship.position.x] = idx;
           }
         }
       });
    }

    checkEmpty(position: IVector){
      return this.enemyField[position.y][position.x ] === Cell.Empty;
    }

    attack(position: IVector){
      if(!this.checkEmpty(position)){
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
    }  

    randomAttack(){
      const possiblePositions:IVector[] = [];
        this.enemyField.forEach((row, y)=>row.map((cell, x)=>{
          if(!cell){
            possiblePositions.push({x,y})
          }
        }))
        const randomPosition = Math.round(Math.random()*(possiblePositions.length-1));
        this.attack(possiblePositions[randomPosition]);
    }
    
    killShip(ship: IShip){
      this.demeges++;
      const height = this.enemyField.length;
      const width =  this.enemyField[0].length;
      if (!ship.direction){ ////====0
        for (let i =-1; i < ship.length+1; i += 1){
          for (let j =-1; j < 2; j += 1){
            if(ship.position.y+j>=0
              &&ship.position.y+j<height
              &&ship.position.x + i>=0
              &&ship.position.x + i<width
              &&!this.enemyField[ship.position.y+j][ship.position.x + i]){
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
            if(ship.position.y+i>=0
                &&ship.position.y+i<height
                &&ship.position.x + j>=0
                &&ship.position.x + j<width
                &&!this.enemyField[ship.position.y+i][ship.position.x + j]){
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
      if(this.demeges===10){
        this.finishGame(this.id);
      }
    }

    checkShip(ship: IShip){
      let isKilled = true;
      for (let i = 0; i < ship.length; i += 1) {
        if (! ship.direction ) { ///===0
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
      return isKilled;
    }

    changeField( position: IVector,status: string=''){
        switch (status){
          case 'miss':{
            this.enemyField[position.y][position.x] = Cell.Unavailable;
            break;
          }
          case 'killed':{
            this.enemyField[position.y][position.x] = Cell.Killed;
            break;
          }
          case 'shot':{
            this.enemyField[position.y][position.x] = Cell.Shot;
            break;
          }
          default:{
            this.enemyField[position.y][position.x] = Cell.Unavailable;
            break;
          }
        }
      }
}