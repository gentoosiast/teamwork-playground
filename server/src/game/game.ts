import { connection } from "websocket";
import {IClients, IShip, IPlayer, IVector,IMessage} from '../dto';
import { BotController } from "./botController";
import { IPlayerController } from "./IPlayerController";
import { PlayerController } from "./playerController";
const botShip =[ {
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
}]

export class Game {
    users: IClients[]=[];
    id:string;
    players: IPlayer[]=[];
    playerControllers= new Map<number, IPlayerController>()
    currentPlayer =0;
    size=0;
    constructor(users:IClients[],id: string){
        this.users = users;
        this.id=id;
        this.users.forEach((c,ind)=>{
          const player = new PlayerController(ind, (position, status, isChangeCurrent)=> this.sendMessageAttack(position, status,isChangeCurrent),(id)=>this.finishGame(id), c.connection);
          this.playerControllers.set(ind,player);
          this.sendMessage(c.connection, "create_game",JSON.stringify({idGame: id, idPlayer:ind }));
        })
    }

    addShip(ships: IShip[], indexPlayer: number){
      const player =this.playerControllers.get(indexPlayer );
      
      player?.addOurShips(ships);
      const enemy = this.playerControllers.get((indexPlayer + 1) % 2 );
      enemy?.addEnemyShips(ships)
      this.size++;

      if(this.size>=2){
        this.playerControllers.forEach(player=>player.startGame())
      } 
    }

    startSingleGame(){
      this.playerControllers.set(1, new BotController(1,(position, status, isChangeCurrent)=> this.sendMessageAttack(position, status,isChangeCurrent), (id)=>this.finishGame(id)));
      this.addShip(botShip,1);
    }

    attack(position: IVector, indexPlayer: number){
      if(this.currentPlayer!==indexPlayer){
        return;
      }
      const player = this.playerControllers.get(indexPlayer);
      player?.attack(position);
    }

    finishGame(winPlayer: number){
      this.users.forEach((user) => {
        this.sendMessage(user.connection, 'finish',JSON.stringify({winPlayer: winPlayer}));
      });
    }

    sendMessageAttack(position: IVector,status: string ,isChangeCurrentPlayer:boolean=false){
      this.users.forEach((user) => {
        this.sendMessage(user.connection, 'attack', JSON.stringify({position, currentPlayer:this.currentPlayer, status}));
      });
      
      if(isChangeCurrentPlayer){
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        const player = this.playerControllers.get(this.currentPlayer);
        player?.nextRound();
      }
      this.users.forEach((user) => {
        this.sendMessage(user.connection, 'turn', JSON.stringify( {currentPlayer:this.currentPlayer}));
      });
    }

    sendMessage(client: connection, message: string, data: string){   
        const responseObj: IMessage = {
          type: message,
          data,
          id: 0
        }
        client.sendUTF(JSON.stringify(responseObj));
    }
}