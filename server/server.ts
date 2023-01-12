import http from "http";
import { IMessage, Cell} from "./src/dto";
import { emptyState } from './src/utils/fieldGenerator'
import * as WebSocket from "websocket";
import Room from "./src/room/room";
import { Game } from "./src/game/game";

interface IPlayer {
  connection: WebSocket.connection;
  index: number;
  shipField: Array<Array<number>>;
}


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
const rooms = new Map<string, Room>()
const games =new Map<string, Game>()

websocket.on('request', (e) => {
  const client = e.accept()
  //clients.push({connection: client, name: 'ddd',index:0 })
  console.log('connect');

  client.on('message', (msg) => {
    if (msg.type != 'utf8') return;
    const parsedMsg: IMessage = JSON.parse(msg.utf8Data);
    console.log(parsedMsg)
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
        game?.attack({x: data.x, y: data.y}, data.indexPlayer )
        break;
      }
      // case 'get_field': {
      //   // const field: IVector = JSON.parse(parsedMsg.data);
      //   const responseObj: IMessage = {
      //     type: "get_field",
      //     data: JSON.stringify(field),
      //     id: 0
      //   }
      //   clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
      //   break;
      // }
      case 'reg':{
        const name = JSON.parse(parsedMsg.data).name;
        const newClient = {connection: client, name: name,index:clients.length }
        clients.push(newClient);

        const responseObj: IMessage = {
          type: "reg",
          data: JSON.stringify({name,index: clients.length-1}),
          id: 0
        }
        client.sendUTF(JSON.stringify(responseObj))
        if(rooms.size ){
          sendMessageRooms(rooms, [newClient])
         
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
        rooms.forEach(it=>it.removeUser(user.connection))
        console.log('CREATEROOM')
        room.addUser(user.connection, user.index,user.name)
        rooms.set(ind, room);
        // const responseObj: IMessage = {
        //   type: "create_room",
        //   data: JSON.stringify({roomId: room.id, roomUsers: room.sendUsers()}),
        //   id: 0
        // }
        // clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
        sendMessageRooms(rooms, clients)
        break;
      } 
      case 'add_user_to_room':{
        const data =JSON.parse(parsedMsg.data);
        const room = rooms.get(data.indexRoom);
        const user = clients.find(it=>it.connection===client)
        if(!room||!user){
          return;
        }
        rooms.forEach(it=>it.removeUser(user.connection))
        room.addUser(user.connection, user.index,user.name)
        
        if(room.users.length>=2){
         const idGame = Math.floor(Math.random()*100)+''
          games.set(idGame, new Game(room.users, idGame) );
          rooms.delete(room.id)
        }
        sendMessageRooms(rooms, clients);
        break;
      }
      case 'single_play':{
       const idGame = Math.floor(Math.random()*100)+'';
       const game = new Game([{ connection: client,
        index: 0,
        name: 'ddd'}], idGame)
       games.set(idGame, game );
       game.startSingleGame();
        break;
      }
      case 'add_ships':{        
        const data =JSON.parse(parsedMsg.data);
        const game = games.get(data.gameId )
        if(game){
            game.addShip(data.ships, data.indexPlayer )
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
    console.log('CLOSE')
    clients.filter(it=> it.connection!==client);
  })
})

const sendMessageRooms = (rooms: Map<string, Room>, clients:IClients[])=>{
  const roomsInfo = [];
        for (const value of rooms.values()) {
          roomsInfo.push({roomId: value.id, roomUsers: value.sendUsers()});
        }
        const responseObj: IMessage = {
          type: "update_room",
          data: JSON.stringify(roomsInfo),
          id: 0
        }
        clients.forEach((c) => c.connection.sendUTF(JSON.stringify(responseObj)));
}