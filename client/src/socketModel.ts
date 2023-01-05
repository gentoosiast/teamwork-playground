import { Dispatch } from "react";
import { emptyState } from "./utils/fieldGenerator";
import { IRegData ,IOurField, IUser, IRoom, IShip,IMessage,Cell} from "./dto";

interface ISocketModel{
  setEnemyField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setOurField: Dispatch<React.SetStateAction<Array<Array<Cell>>>>;
  setPlayerIdx: Dispatch<React.SetStateAction<number>>;
  setPage:(page: string)=>void;
  setUserData: Dispatch<React.SetStateAction<IUser>>
  setRoom: Dispatch<React.SetStateAction<IRoom[]>>
  setIdGame: Dispatch<React.SetStateAction<number>>
  setCurrentPlayer: Dispatch<React.SetStateAction<boolean>>
}
export class SocketModel {
  webSocket: WebSocket;
  playerIdx: number = -1;
  rooms: []=[]
  user:IUser;
  constructor({ setEnemyField, setOurField, setPlayerIdx, setPage,setUserData,setRoom,setIdGame,setCurrentPlayer}:ISocketModel) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data);
      const parsedData = parsedMsg.data;
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
          setCurrentPlayer(currentPlayer=== this.playerIdx)
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
          const currentPlayer = JSON.parse(parsedMsg.data).currentPlayerIndex === this.playerIdx;
          setCurrentPlayer(currentPlayer)
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
          setIdGame(data.idGame);
          setPlayerIdx(data.idPlayer);
          this.playerIdx = data.idPlayer;
          setPage('chooseShip');
          break;
        }
        case 'finish':{
          const {winPlayer} = JSON.parse(parsedData);
          if(winPlayer===this.playerIdx){
            console.log('YOU WIN');
          }else{
            console.log('YOU LOSER')
          }
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