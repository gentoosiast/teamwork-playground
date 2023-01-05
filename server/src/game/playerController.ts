import { connection } from "websocket";
import { IVector, IMessage } from "../dto";
import { IPlayerController } from "./IPlayerController";

export class PlayerController extends IPlayerController{
    client: connection;
    
    constructor(id: number, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void,finishGame:(winPlayer:number)=>void, client: connection){
        super(id, sendMessage,finishGame);
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