import http from "http";
import { IMessage } from "../interface/IMessage";
import { IOurField, IEnemyField, Cell } from '../interface/IField';
import { emptyState } from '../interface/fieldGenerator'
import { IVector } from '../interface/IVector';
import * as WebSocket from "websocket";
import { DataBase } from "./src/database/db";
import { json } from "body-parser";
import Room from "./src/room/room";
import { Game } from "./src/game/game";
const db = new DataBase();

interface IPlayer {
  connection: WebSocket.connection;
  index: number;
  shipField: Array<Array<number>>;
}

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

const server = http.createServer((req, res) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')
  res.setHeader('Content-Type', 'text/plain')
  console.log((new Date()) + ' Received request for ' + req.url);
  const reqData = req.url?.split("?");
  if (!reqData) {
    throw new Error("Empty request data");
  }
  const endpoint = reqData[0];
  if (reqData.length > 1) {
    const queryParams = reqData[1].split("&").map((el) => {
      const [key, val] = el.split("=");
      return { key, val };
    });

    queryParams[0].val = queryParams[0].val.replace('%40', '@');
    console.log(endpoint, queryParams);
    if (db.checkUser(queryParams[0].val)) {
      db.getNewUser(queryParams[0].val, queryParams[1].val);
      console.log(db.getDatabase());
    } else console.log('You are already registered');
  }
  res.end("recieved");
});

server.listen(3000, () => {
  console.log((new Date()) + ' Server is listening port 3000');
});

interface IClients{
  connection: WebSocket.connection,
  index: number,
  name: string,
};


const websocket = new WebSocket.server({ httpServer: server })
const messages: Array<string> = [];
const field: Array<Array<Cell>> = emptyState();
const field2: Array<Array<Cell>> = emptyState();
const fields = [field, field2];
let currentPlayer = 0;

const clients: Array<IClients> = [];
const players: Array<IPlayer> = [];

const rooms = new Map<string, Room>()
const games =new Map<string, Game>()

websocket.on('request', (e) => {
  const client = e.accept()
  //clients.push({connection: client, name: 'ddd',index:0 })
  console.log('connect');

  client.on('message', (msg) => {
    console.log(msg)
    if (msg.type != 'utf8') return;
    const parsedMsg: IMessage = JSON.parse(msg.utf8Data)
    switch (parsedMsg.type) {
      // case 'chat_message': {
      //   messages.push(parsedMsg.data)
      //   const chatObj: IMessage = {
      //     type: "chat_message",
      //     data: parsedMsg.data,
      //     id: 0
      //   }
      //   clients.forEach(c => {
      //     c.connection.sendUTF(JSON.stringify(chatObj))
      //   })
      //   break;
      // }
      // case 'chat_history': {
      //   const chatObj: IMessage = {
      //     type: "chat_history",
      //     data: JSON.stringify(messages),
      //     id: 0
      //   }
      //   client.sendUTF(JSON.stringify(chatObj))
      //   break;
      // }
      case 'attack': {
        
        const data= JSON.parse(parsedMsg.data);
        const game = games.get(data.gameId);
        game?.attack({x: data.x, y: data.y}, client )
        break;
      }
      case 'get_field': {
        // const field: IVector = JSON.parse(parsedMsg.data);
        const responseObj: IMessage = {
          type: "get_field",
          data: JSON.stringify(field),
          id: 0
        }
        clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
        break;
      }
      case 'reg':{
        const name = JSON.parse(parsedMsg.data).name
        clients.push({connection: client, name: name,index:clients.length });

        const responseObj: IMessage = {
          type: "reg",
          data: JSON.stringify({name,index: clients.length-1}),
          id: 0
        }
        client.sendUTF(JSON.stringify(responseObj))
        if(rooms.size ){
          rooms.forEach(room=>{
            const responseObj: IMessage = {
              type: "create_room",
              data: JSON.stringify({roomId: room.id, roomUsers: room.sendUsers()}),
              id: 0
            }
           
            client.sendUTF(JSON.stringify(responseObj))
          })
        } 
        break; 
      }
      case 'create_room':{
        const ind = Math.floor(Math.random()*100)+'';
        const room = new Room(ind);
        const user = clients.find(it=>it.connection===client)
        if(!user){
          return;
        }
        console.log('CREATEROOM')
        room.addUser(user.connection, user.index,user.name)
        rooms.set(ind, room);
        const responseObj: IMessage = {
          type: "create_room",
          data: JSON.stringify({roomId: room.id, roomUsers: room.sendUsers()}),
          id: 0
        }
        clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
        break;
      } 
      case 'add_user_to_room':{
        console.log(parsedMsg.data)
        const data =JSON.parse(parsedMsg.data);
        const room = rooms.get(data.indexRoom);
        const user = clients.find(it=>it.connection===client)
        if(!room||!user){
          return;
        }
        room.addUser(user.connection, user.index,user.name)
        const responseObj: IMessage = {
          type: "create_room",
          data: JSON.stringify({roomId: room.id, roomUsers: room.sendUsers()}),
          id: 0
        }
        clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
        if(room.users.length>=2){
          const idGame = Math.floor(Math.random()*100)+''
          games.set(idGame, new Game(room.users, idGame) );
        
          // room.users.forEach((c, ind)=>{
          //   const responseObj: IMessage = {
          //     type: "create_game",
          //     data: JSON.stringify({roomUsers: room.sendUsers(), idGame, idPlayer:ind }),
          //     id: 0
          //   }
          //   c.connection.sendUTF(JSON.stringify(responseObj))
          // });
        }
        break;
      }
      case 'start_game':{
        const data =JSON.parse(parsedMsg.data);
        const game = games.get(data.gameId )
        if(game){
            game.startGame()
        }
        break;

      }
      // case 'join': {
      //   const shipField: Array<Array<number>> = [];
      //   for (let i = 0; i < 9; i += 1) {
      //     const row = [];
      //     for (let j = 0; j < 9; j += 1) {
      //       row.push(-1);
      //     }
      //     shipField.push(row);
      //   }
      //   players.push({connection: client, index: players.length, shipField});
       
      //   break;
      // }
      default:
        break;
    }
  })
  client.on('close', () => {
    clients.filter(it=> it.connection!==client);
    const playerIdx = players.findIndex(player => client === player.connection);
    if (playerIdx !== -1) {
      players.splice(playerIdx, 1);
    }
  })
})

