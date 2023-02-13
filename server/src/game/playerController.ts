import { connection } from "websocket";
import {IVector, IMessage, IShip} from "../dto";
import { IPlayerController } from "./IPlayerController";

export class PlayerController extends IPlayerController{
    client: connection;
    
    constructor(id: number, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void,finishGame:(winPlayer:number)=>void, client: connection){
        super(id, sendMessage,finishGame);
        this.client= client;
    }
    addEnemyShips(ships: IShip[]){
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
                    //===0
                    this.shipField[ship.position.y][ship.position.x + i] = idx;
                } else {
                    this.shipField[ship.position.y + i][ship.position.x] = idx;
                }
            }
        });
    }
    startGame(){
        const responseObj: IMessage = {
            type: "start_game",
            data: JSON.stringify({ ships:this.ourShips, currentPlayerIndex:this.id }),
            id: 0
        };
        this.client.sendUTF(JSON.stringify(responseObj))

    }
}