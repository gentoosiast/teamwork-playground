import { connection } from "websocket";
import { emptyState } from "../../../interface/fieldGenerator";
import { Cell } from "../../../interface/IField";
import { IMessage } from "../../../interface/IMessage";
import { IVector } from "../../../interface/IVector";
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
interface IClients{
    connection: connection,
    index: number,
    name: string,
  };

  export interface IShip {
    position: {
        x: number;
        y: number;
    };
    direction: number;
    length: number;
}

  const field: Array<Array<Cell>> = emptyState();
const field2: Array<Array<Cell>> = emptyState();
const fields = [field, field2];
interface IPlayer {
    connection: connection;
    index: number;
    shipField: Array<Array<number>>;
    ships: IShip[]
  }
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
          const player = new PlayerController(ind, (position, status, isChangeCurrent)=> this.sendMessageAttack(position, status,isChangeCurrent), c.connection);
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
      
      
      
  
      //  const shipField: Array<Array<number>> = [];
      //  for (let i = 0; i < 9; i += 1) {
      //   const row = [];
      //   for (let j = 0; j < 9; j += 1) {
      //     row.push(-1);
      //   }
      //   shipField.push(row);
      // }
       
      // ships.forEach((ship, idx) => {
      //   for (let i = 0; i < ship.length; i += 1) {
      //     if (ship.direction === 0) {
      //       shipField[ship.position.y][ship.position.x + i] = idx;
      //     } else {
      //       shipField[ship.position.y + i][ship.position.x] = idx;
      //     }
      //   }
      // });
     
      //   const player = this.users.find(it=>it.connection===client);
      //   if(player){
      //      this.players.push({...player, shipField,index: indexPlayer,ships }); 
      //   }
      //   if(this.players.length>=2){
      //     this.startGame()
      //   }
       

    }
    // startGame(){      
    //   this.players.forEach(player=>{
    //     const responseObj: IMessage = {
    //       type: "start_game",
    //       data: JSON.stringify({ ships:player.ships }),
    //       id: 0
    //     };
    //     player.connection.sendUTF(JSON.stringify(responseObj))
    //   })
              
      
    // }
    startSingleGame(){
      this.playerControllers.set(1, new BotController(1,(position, status, isChangeCurrent)=> this.sendMessageAttack(position, status,isChangeCurrent)));
      this.addShip(botShip,1);



    }
    attack(position: IVector, indexPlayer: number){
      if(this.currentPlayer!==indexPlayer){
        return;
      }
      const player = this.playerControllers.get(indexPlayer);
      player?.attack(position);
      
        // const player =this.players.find((player) => player.connection === client);
        // console.log("DEBUG: currentPlayer, player.index", this.currentPlayer, player?.index);
        // if (player?.index !== this.currentPlayer) {
        //   return;
        // }
        // //перевірка, що облвсть вже тикнута 
        // const shipIndex = this.players[(this.currentPlayer)].shipField[position.y][position.x];
      
        // this.changeField(position);
        // if (shipIndex === -1) {
        //   this.sendMessage(position, 'miss');
        //   this.currentPlayer = (this.currentPlayer + 1) % 2;
        //   return;
        // }        
        // const ship = this.players[(this.currentPlayer)].ships[shipIndex];
        // let isKilled = true;
        // for (let i = 0; i < ship.length; i += 1) {
        //     if (ship.direction === 0) {
        //       if (fields[(this.currentPlayer + 1) % 2][ship.position.y][ship.position.x + i] === Cell.Empty) {
        //         isKilled = false;
        //         break;
        //       }
        //   } else {
        //       if (fields[(this.currentPlayer + 1) % 2][ship.position.y + i][ship.position.x] === Cell.Empty) {
        //           isKilled = false;
        //           break;
        //       }
        //   }
        // }
       
        // if(!isKilled){
        //   this.changeField(position, 'shot');
        //   this.sendMessage(position, 'shot');
        // } else{
        //   const height = fields[this.currentPlayer].length;
        //   const width = fields[this.currentPlayer][0].length;
        //   if (ship.direction === 0){
        //     for (let i =-1; i < ship.length+1; i += 1){
        //       for (let j =-1; j < 2; j += 1){
        //         if(ship.position.y+j>=0&&ship.position.y+j<height&&ship.position.x + i>=0&&ship.position.x + i<width){
        //            this.changeField({y: ship.position.y+j, x:ship.position.x + i}, 'miss');
        //           this.sendMessage({y: ship.position.y+j, x:ship.position.x + i}, 'miss');
        //         }                
        //       }             
        //     }
        //     for (let i = 0; i < ship.length; i += 1){
        //       this.changeField({y: ship.position.y, x:ship.position.x + i}, 'killed');
        //       this.sendMessage({y: ship.position.y, x:ship.position.x + i}, 'killed');
        //     }
        //   } else {
        //     for (let i =-1; i < ship.length+1; i += 1){
        //       for (let j =-1; j < 2; j += 1){
        //         if(ship.position.y+i>=0&&ship.position.y+i<height&&ship.position.x + j>=0&&ship.position.x + j<width){
        //           this.changeField({y: ship.position.y+i, x:ship.position.x + j}, 'miss');
        //           this.sendMessage({y: ship.position.y+i, x:ship.position.x + j}, 'miss');
        //         }            
        //       }             
        //     }
        //     for (let i = 0; i < ship.length; i += 1){
        //       this.changeField({y: ship.position.y+i, x:ship.position.x }, 'killed');
        //       this.sendMessage({y: ship.position.y+i, x:ship.position.x}, 'killed');
        //     }
        //   }

        // }

    }

    sendMessageAttack(position: IVector,status: string ,isChangeCurrent:boolean=false){
      this.users.forEach((user) => {
        this.sendMessage(user.connection, 'attack', JSON.stringify({position, currentPlayer:this.currentPlayer, status}));
      });
      
      if(isChangeCurrent){
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        const player = this.playerControllers.get(this.currentPlayer);
        player?.nextRound();
      }
      this.users.forEach((user) => {
        this.sendMessage(user.connection, 'turn', JSON.stringify( {currentPlayer:this.currentPlayer}));
      });
    
    }
    sendMessage(client: connection, mes: string, data: string){   
        const responseObj: IMessage = {
          type: mes,
          data,
          id: 0
        }
        client.sendUTF(JSON.stringify(responseObj))

    }
    
    // changeField( position: IVector,status: string=''){
    //   switch (status){
    //     case 'miss':{
    //       fields[(this.currentPlayer + 1) % 2][position.y][position.x] = Cell.Unavailable;
    //       break;
    //     }
    //     case 'killed':{
    //       fields[(this.currentPlayer + 1) % 2][position.y][position.x] = Cell.Killed;
    //       break;
    //     }
    //     case 'shot':{
    //       fields[(this.currentPlayer + 1) % 2][position.y][position.x] = Cell.Shot;
    //       break;
    //     }
    //     default:{
    //       fields[(this.currentPlayer + 1) % 2][position.y][position.x] = Cell.Unavailable;
    //       break;
    //     }
    //   }
    // }
}