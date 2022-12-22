import { connection } from "websocket";
import { emptyState } from "../../../interface/fieldGenerator";
import { Cell } from "../../../interface/IField";
import { IMessage } from "../../../interface/IMessage";
import { IVector } from "../../../interface/IVector";

interface IClients{
    connection: connection,
    index: number,
    name: string,
  };

  
const ships = [
    {
      position: {x: 0, y: 0},
      direction: 1,
      length: 3
    },
    {
      position: {x: 4, y: 4},
      direction: 0,
      length: 2
    },
    {
      position: {x: 8, y: 8},
      direction: 0,
      length: 1
    }
  ];

  const field: Array<Array<Cell>> = emptyState();
const field2: Array<Array<Cell>> = emptyState();
const fields = [field, field2];
interface IPlayer {
    connection: connection;
    index: number;
    shipField: Array<Array<number>>;
  }
export class Game {
    users: IClients[]=[];
    id:string;
    players: IPlayer[]=[];
    currentPlayer =0;
    constructor(users:IClients[],id: string){
        this.users = users;
        this.id=id;
        this.users.forEach((c,ind)=>{
          const responseObj: IMessage = {
                type: "create_game",
                data: JSON.stringify({idGame: id, idPlayer:ind }),
                id: 0
              }
              c.connection.sendUTF(JSON.stringify(responseObj))
        })
    }
    startGame(){      
              const shipField: Array<Array<number>> = [];
              for (let i = 0; i < 9; i += 1) {
                const row = [];
                for (let j = 0; j < 9; j += 1) {
                  row.push(-1);
                }
                shipField.push(row);
              }
      
              ships.forEach((ship, idx) => {
                for (let i = 0; i < ship.length; i += 1) {
                  if (ship.direction === 0) {
                    shipField[ship.position.y][ship.position.x + i] = idx;
                  } else {
                    shipField[ship.position.y + i][ship.position.x] = idx;
                  }
                }
              });
              const shipForClient = emptyState();
              ships.forEach((ship) => {
                for (let i = 0; i < ship.length; i += 1) {
                  if (ship.direction === 0) {
                    shipForClient[ship.position.y][ship.position.x + i] = Cell.Occupied;
                  } else {
                    shipForClient[ship.position.y + i][ship.position.x] = Cell.Occupied;
                  }
                }
              });
              const responseObj: IMessage = {
                type: "join",
                data: JSON.stringify({ ships: shipForClient}),
                id: 0
              };

              this.users.forEach((c, index)=>{
                this.players.push({...c,shipField,index });
                c.connection.sendUTF(JSON.stringify(responseObj))
              }         ); 
           
              
    }

    attack(position: IVector, client: connection){
        const player =this.players.find((player) => player.connection === client);
        console.log("DEBUG: currentPlayer, player.index", this.currentPlayer, player?.index);
        if (player?.index !== this.currentPlayer) {
          return;
        }
        const shipIndex = this.players[(this.currentPlayer + 1) % 2].shipField[position.y][position.x];
        this.changeField(position);
        if (shipIndex === -1) {
          this.sendMessage(position, 'miss');
          this.currentPlayer = (this.currentPlayer + 1) % 2;
          return;
        }        
        const ship = ships[shipIndex];
        let isKilled = true;
        for (let i = 0; i < ship.length; i += 1) {
            if (ship.direction === 0) {
              if (fields[this.currentPlayer][ship.position.y][ship.position.x + i] === Cell.Empty) {
                isKilled = false;
                break;
              }
          } else {
              if (fields[this.currentPlayer][ship.position.y + i][ship.position.x] === Cell.Empty) {
                  isKilled = false;
                  break;
              }
          }
        }
       
        if(!isKilled){
          this.changeField(position, 'shot');
          this.sendMessage(position, 'shot');
        } else{
          const height = fields[this.currentPlayer].length;
          const width = fields[this.currentPlayer][0].length;
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
          // for (let i = 0; i < ship.length; i += 1){
          //   if (ship.direction === 0){
          //     this.changeField({y: ship.position.y, x:ship.position.x + i}, 'killed');
          //     this.sendMessage({y: ship.position.y, x:ship.position.x + i}, 'killed');
          //   } else {
          //     this.changeField({y: ship.position.y+i, x:ship.position.x }, 'killed');
          //     this.sendMessage({y: ship.position.y+i, x:ship.position.x}, 'killed');
          //   }
          // }

        }

    }

    sendMessage(position: IVector,status: string ){
      this.players.forEach((player) => {
        const responseObj: IMessage = {
          type: "attack",
          data: JSON.stringify({position, currentPlayer:this.currentPlayer, status}),
          id: 0
        }
        player.connection.sendUTF(JSON.stringify(responseObj))
      });
    }
    
    changeField( position: IVector,status: string=''){
      switch (status){
        case 'miss':{
          fields[this.currentPlayer][position.y][position.x] = Cell.Unavailable;
          break;
        }
        case 'killed':{
          fields[this.currentPlayer][position.y][position.x] = Cell.Killed;
          break;
        }
        case 'shot':{
          fields[this.currentPlayer][position.y][position.x] = Cell.Shot;
          break;
        }
        default:{
          fields[this.currentPlayer][position.y][position.x] = Cell.Unavailable;
          break;
        }
      }
    }
}