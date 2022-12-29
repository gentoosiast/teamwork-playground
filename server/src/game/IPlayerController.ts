import { connection } from "websocket";
import { emptyState } from "../../../interface/fieldGenerator";
import { Cell } from "../../../interface/IField";
import { IMessage } from "../../../interface/IMessage";
import { IVector } from "../../../interface/IVector";
import { IShip } from "./game";

export class IPlayerController{
    id: number;
    ships: IShip[] = [];
    shipField:Array<Array<number>> = [];
    field: Array<Array<Cell>> = emptyState();
    enemyField: Array<Array<Cell>> = emptyState();
    sendMessage: (position: IVector,status: string, isChangeCurrent?: boolean)=>void;
    ourShips: IShip[]=[];
    
    constructor(id: number, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void){
        this.id = id;
        this.sendMessage = (position,status, isChangeCurrent=false)=>{
            sendMessage(position,status,isChangeCurrent)
        }
    }
    startGame(){}
    nextRound(){
        console.log()
    }
    addOurShips(ships: IShip[]){
        this.ourShips = ships;
    }
    addEnemyShips(ships: IShip[]){
        this.ships = ships;
        
        for (let i = 0; i < 9; i += 1) {
         const row = [];
         for (let j = 0; j < 9; j += 1) {
           row.push(-1);
         }
         this.shipField.push(row);
       }        
       ships.forEach((ship, idx) => {
         for (let i = 0; i < ship.length; i += 1) {
           if (ship.direction === 0) {
             this.shipField[ship.position.y][ship.position.x + i] = idx;
           } else {
             this.shipField[ship.position.y + i][ship.position.x] = idx;
           }
         }
       });
       console.log(this.shipField)
    }
    attack(position: IVector){
      if(this.enemyField[position.y][position.x ] !== Cell.Empty){
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
    
    killShip(ship: IShip){
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
    checkShip(ship: IShip){
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