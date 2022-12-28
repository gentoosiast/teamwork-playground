import { IPlayerController } from "./IPlayerController";


export class BotController extends IPlayerController{
    nextRound(): void {
        this.attack({x:Math.floor(Math.random()*9),y:Math.floor(Math.random()*9)})
    }
}