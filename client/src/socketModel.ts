import { Dispatch } from "react";
import { Cell } from "../../interface/IField";
import { IMessage } from "../../interface/IMessage";
import { IRegData ,IOurField, IUser, IRoom} from "./dto";

interface ISocketModel{
  setMessages:Dispatch<React.SetStateAction<Array<string>>>;
  setEnemyField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setOurField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setPlayerIdx: Dispatch<React.SetStateAction<number>>;
  setShips: Dispatch<React.SetStateAction<any>>;
  setPage:(page: string)=>void;
  setUserData: Dispatch<React.SetStateAction<IUser>>
  setRoom: Dispatch<React.SetStateAction<IRoom[]>>
  setIdGame: Dispatch<React.SetStateAction<number>>
}
export class SocketModel {
  webSocket: WebSocket;
  playerIdx: number = -1;
  rooms: []=[]
  constructor({setMessages, setEnemyField, setOurField, setPlayerIdx, setShips,setPage,setUserData,setRoom,setIdGame}:ISocketModel) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data);
      const parsedData = parsedMsg.data;

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
          console.log(status);
          console.log(position)
          const setField = [setEnemyField, setOurField][(currentPlayer + this.playerIdx) % 2]
          setField((last:Array<Array<number>>) => {
            console.log(last);
            return last.map((row, y) => {
              return row.map((cell, x) => {
                if (status === 'killed') {
                  return position.x === x && position.y === y ? Cell.Killed : cell;
                } else if (status === 'shot') {
                  return position.x === x && position.y === y ? Cell.Shot : cell;
                }
                return position.x === x && position.y === y ? Cell.Unavailable : cell;
              })
            })
          })
          break;
        }
        case 'get_field': {
          const field = JSON.parse(parsedMsg.data)
          console.log(field)
          setEnemyField(field)
          break;
        }
        case 'join': {
          setPage('gameField');
          const { ships, idx: index } = JSON.parse(parsedMsg.data);
          setPlayerIdx(index);
          setShips(ships);
          this.playerIdx = index;
          break;
        }
        case 'reg':{
          setUserData(JSON.parse(parsedData))
          setPage('room');
        break;  
        }
        case 'create_room':{
          const content = JSON.parse(parsedData)
          setRoom(data=>{
            const room = data.find(it=>it.roomId==content.roomId);
            if(!room){
              return [...data, content] 
            }else{
              return data.map(it=>{
                if(it.roomId==content.roomId){
                  return content
                }
                return it;
              })
            }
          });
          break;
        }
        case 'create_game':{
          setIdGame(JSON.parse(parsedData).idGame)
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
      id: 0
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
  addUserToRoom(user:IUser, indexRoom: number){
    const request: IMessage = {
      type: 'add_user_to_room',
      data: JSON.stringify({user, indexRoom}),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
  startGame(user:IUser,gameId: number){
    const request: IMessage = {
      type: 'start_game',
      data: JSON.stringify({user,gameId}),
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
}