import { Dispatch } from "react";
import { emptyState } from "../../interface/fieldGenerator";
import { Cell } from "../../interface/IField";
import { IMessage } from "../../interface/IMessage";
import { IRegData ,IOurField, IUser, IRoom, IShip} from "./dto";

interface ISocketModel{
  setEnemyField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setOurField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setPlayerIdx: Dispatch<React.SetStateAction<number>>;
  setPage:(page: string)=>void;
  setUserData: Dispatch<React.SetStateAction<IUser>>
  setRoom: Dispatch<React.SetStateAction<IRoom[]>>
  setIdGame: Dispatch<React.SetStateAction<number>>
}
export class SocketModel {
  webSocket: WebSocket;
  playerIdx: number = -1;
  rooms: []=[]
  user:IUser;
  constructor({ setEnemyField, setOurField, setPlayerIdx, setPage,setUserData,setRoom,setIdGame}:ISocketModel) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data);
      const parsedData = parsedMsg.data;
      console.log('TYPE', parsedMsg.type);        console.log('playerInd', this.playerIdx)
      switch (parsedMsg.type) {
        // case 'chat_message': {
        //   console.log(parsedMsg.data)
        //   setMessages((last) => {
        //     return [parsedMsg.data, ...last]
        //   })
        //   // this.onMesssage(parsedMsg.data);
        //   break;
        // }
        // case 'chat_history': {
        //   const msgList: Array<string> = JSON.parse(parsedMsg.data)
        //   console.log(msgList)
        //   setMessages(msgList.reverse())
        //   break;
        // }

        case 'attack': {
          const {position, currentPlayer, status} = JSON.parse(parsedMsg.data)
          
          console.log('ATTACK', position, currentPlayer, status)
          const setField = [setEnemyField, setOurField][(currentPlayer + this.playerIdx) % 2]
          setField((last:Array<Array<number>>) => {
            const arr = last.map((row, y) => {
              return row.map((cell, x) => {
                if (status === 'killed') {
                  return position.x === x && position.y === y ? Cell.Killed : cell;
                } else if (status === 'shot') {
                  return position.x === x && position.y === y ? Cell.Shot : cell;
                }
                return position.x === x && position.y === y ? Cell.Unavailable : cell;
              })
            })
            console.log(arr)
            return arr;
          })
          break;
        }
        case 'get_field': {
          const field = JSON.parse(parsedMsg.data)
          console.log(field)
          setEnemyField(field)
          break;
        }
        case 'start_game': {     
          setPage('gameField');
          const ships:IShip[] = JSON.parse(parsedMsg.data).ships;
          const shipForClient = emptyState();
          ships.forEach((ship) => {
                for (let i = 0; i < ship.length; i += 1) {
                  if (ship.direction === 0) {
                    shipForClient[ship.position.y][ship.position.x + i] = Cell.Occupied;
                  } else {
                    shipForClient[ship.position.y + i][ship.position.x] = Cell.Occupied;
                  }
                }
              });
          setOurField(shipForClient);
          break;
        }
        case 'reg':{
          this.user = JSON.parse(parsedData);
          setUserData(this.user)
          setPage('room');
        break;  
        }
        case 'update_room':{
          const content = JSON.parse(parsedData);
          setRoom(content)
          break;
        }
        case 'create_game':{
          //idPlayer
          const data = JSON.parse(parsedData)
          console.log('create_game', data)
          setIdGame(data.idGame);
          setPlayerIdx(data.idPlayer);
          this.playerIdx = data.idPlayer;
          setPage('chooseShip');
          break;
        }
        default:
          break;
      }

      // setMessages((last) => {
      //   return [msg.data, ...last]
      // })
    }
    websocket.onopen = () => {
      console.log('connected');

      // setSocket(websocket)
      // const request: IMessage = {
      //   type: 'chat_history',
      //   data: '',
      //   id: 0
      // }
      // const joinRequest: IMessage = {
      //   type: 'join',
      //   data: '',
      //   id: 0
      // }
      // websocket.send(JSON.stringify(joinRequest));
      // websocket.send(JSON.stringify(request))
      // const getField: IMessage = {
      //   type: 'get_field',
      //   data: '',
      //   id: 0
      // }
      // websocket.send(JSON.stringify(getField))
    }
  }

  loadField() {
    const getField: IMessage = {
      type: 'get_field',
      data: '',
      id: this.playerIdx
    }
    this.webSocket.send(JSON.stringify(getField))
  }

  loadChatMessages() {
    const request: IMessage = {
      type: 'chat_history',
      data: '',
      id: 0
    }
    this.webSocket.send(JSON.stringify(request));
  }

  close() {
    this.webSocket.close();
  }

  attack(x: number, y: number,gameId:number) {
    const request: IMessage = {
      type: 'attack',
      data: JSON.stringify({ x, y ,gameId}),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }

  sendChatMessage(inputMsg: string) {
    const request: IMessage = {
      type: 'chat_message',
      data: inputMsg,
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }

  reg(data:IRegData){
    const request: IMessage = {
      type: 'reg',
      data: JSON.stringify(data),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
  createRoom(){
    const request: IMessage = {
      type: 'create_room',
      data: '',
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
  addUserToRoom(indexRoom: number){
    const request: IMessage = {
      type: 'add_user_to_room',
      data: JSON.stringify({user: this.user, indexRoom}),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
  startGame(gameId: number, ships: IShip[]){
    const request: IMessage = {
      type: 'add_ships',
      data: JSON.stringify({user: this.user,gameId, ships, indexPlayer: this.playerIdx}),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }

  addShipsInGame(ships: IShip[]){

  }
}