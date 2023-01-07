import { Dispatch } from "react";
import { emptyState } from "./utils/fieldGenerator";
import { IRegData , IUser, IRoom, IShip,IMessage,Cell} from "./dto";
import {addUserName,addUserIndex,addIdGame,changeCurrentPlayer,setWinner} from './reducer/userReducer';
import { setRooms } from "./reducer/roomsReducer";
import { changePage } from './reducer/pagesReduser';
interface ISocketModel{
  setEnemyField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setOurField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  dispatch: any
}

export class SocketModel {
  webSocket: WebSocket;
  playerIdx: number = -1;
  rooms: []=[]
  user:IUser;
  constructor({ setEnemyField, setOurField, dispatch}:ISocketModel) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data);
      const parsedData = parsedMsg.data;
      console.log(parsedMsg)
      switch (parsedMsg.type) {
        // case 'chat_message': {

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
        case 'turn':{
          const {currentPlayer} = JSON.parse(parsedMsg.data);
          dispatch(changeCurrentPlayer({isCurrentPlayer: currentPlayer=== this.playerIdx}))
          break;
        }
        case 'attack': {
          const {position, currentPlayer, status} = JSON.parse(parsedMsg.data)
          
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
            return arr;
          })
          break;
        }
        case 'get_field': {
          const field = JSON.parse(parsedMsg.data)
          setEnemyField(field)
          break;
        }
        case 'start_game': {     
          dispatch(changePage({page:'gameField'}))
          dispatch(setWinner({winner:false}));
          const {ships,currentPlayerIndex} = JSON.parse(parsedMsg.data);
          const shipForClient = emptyState();
          ships.forEach((ship:IShip) => {
                for (let i = 0; i < ship.length; i += 1) {
                  if (ship.direction === 0) {
                    shipForClient[ship.position.y][ship.position.x + i] = Cell.Occupied;
                  } else {
                    shipForClient[ship.position.y + i][ship.position.x] = Cell.Occupied;
                  }
                }
              });
          setOurField(shipForClient);
          dispatch(changeCurrentPlayer({isCurrentPlayer: currentPlayerIndex=== this.playerIdx}))
          break;
        }
        case 'reg':{
          this.user = JSON.parse(parsedData);
          dispatch(addUserName({name: this.user.name}))
          dispatch(changePage({page:'room'}))
          
        break;  
        }
        case 'update_room':{
          const content:IRoom[] = JSON.parse(parsedData);
          dispatch(setRooms({data:content}))
          break;
        }
        case 'create_game':{
          //idPlayer
          const {idPlayer,idGame} = JSON.parse(parsedData)                 
          this.playerIdx = idPlayer;
          dispatch(addUserIndex({index: idPlayer}))
          dispatch(addIdGame({idGame:idGame }))
          dispatch(changePage({page:'chooseShip'}))
          
          break;
        }
        case 'finish':{
          const {winPlayer} = JSON.parse(parsedData);   
            dispatch(setWinner({winner: winPlayer===this.playerIdx}))
            dispatch(changePage({page:'finishGame'}))
  
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
      data: JSON.stringify({ x, y ,gameId, indexPlayer: this.playerIdx}),
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
  singlePlay(){
    const request: IMessage = {
      type: 'single_play',
      data: '',
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
}