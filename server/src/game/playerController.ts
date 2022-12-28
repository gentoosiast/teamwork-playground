import { connection } from "websocket";
import { emptyState } from "../../../interface/fieldGenerator";
import { Cell } from "../../../interface/IField";
import { IMessage } from "../../../interface/IMessage";
import { IVector } from "../../../interface/IVector";
import { IShip } from "./game";
import { IPlayerController } from "./IPlayerController";

export class PlayerController extends IPlayerController{
    
    constructor(id: number, client: connection, sendMessage: (position: IVector,status: string, isChangeCurrent: boolean)=>void){
        super(id, client, sendMessage);
    }
}