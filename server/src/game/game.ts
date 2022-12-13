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
      direction: 1,
      length: 2
    },
    {
      position: {x: 7, y: 7},
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
    id:number=-1;
    players: IPlayer[]=[];
    currentPlayer =0;
    constructor(users:IClients[],id: number){
        this.users = users;
        this.id=id;
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
              const responseObj: IMessage = {
                type: "join",
                data: JSON.stringify({ ships}),
                id: 0
              };
              this.users.forEach(c=>{
                this.players.push({...c,shipField });
                c.connection.sendUTF(JSON.stringify(responseObj))
              }         );
           
              
    }

    attack(position: IVector, client: connection){
        const player =this.players.find((player) => player.connection === client);
        console.log("DEBUG: currentPlayer, player.index", this.currentPlayer, player?.index);
        if (player?.index !== this.currentPlayer) {
          return;
        }
        fields[this.currentPlayer][position.y][position.x] = Cell.Unavailable
        const shipIndex = this.players[(this.currentPlayer + 1) % 2].shipField[position.y][position.x];
        let status = 'miss';
        let nextPlayer = this.currentPlayer;
        if (shipIndex === -1) {
          nextPlayer = (this.currentPlayer + 1) % 2;
        } else {
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
          status = isKilled ? 'killed' : 'shot';
        }
        this.players.forEach((player) => {
          const responseObj: IMessage = {
            type: "attack",
            data: JSON.stringify({position, currentPlayer:this.currentPlayer, status}),
            id: 0
          }
          player.connection.sendUTF(JSON.stringify(responseObj))
        });
        this.currentPlayer = nextPlayer;
    }
}