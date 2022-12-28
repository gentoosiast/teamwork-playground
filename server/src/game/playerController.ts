import { connection } from "websocket";
import { emptyState } from "../../../interface/fieldGenerator";
import { Cell } from "../../../interface/IField";
import { IMessage } from "../../../interface/IMessage";
import { IVector } from "../../../interface/IVector";
import { IShip } from "./game";
import { IPlayerController } from "./IPlayerController";

export class PlayerController extends IPlayerController{
    client: connection;
    
    constructor(id: number, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void,client: connection){
        super(id, sendMessage);
        this.client= client;
    }
    startGame(){
        const responseObj: IMessage = {
            type: "start_game",
            data: JSON.stringify({ ships:this.ourShips, currentPlayerIndex:0 }),
            id: 0
        };
        this.client.sendUTF(JSON.stringify(responseObj))

    }
}