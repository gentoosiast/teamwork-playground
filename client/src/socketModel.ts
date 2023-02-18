import { Dispatch } from "react";
import { emptyState } from "./utils/fieldGenerator";
import {IRegData, IUser, IRoom, IShip, IMessage, Cell, AppDispatch, tShipCanvas} from "./dto";
import {addUserName,addUserIndex,addIdGame,changeCurrentPlayer,setWinner,addError} from './reducer/userReducer';
import {setWinners} from './reducer/winnerReducer';
import { setRooms } from "./reducer/roomsReducer";
import { changePage } from './reducer/pagesReducer';
import {changeField,addField, clearField} from './reducer/fieldsReducer';
import Sound from './utils/sound';
import { changeTimer } from "./reducer/timerReducer";
import { cleanShips } from "./reducer/shipsReducer";
import { clearMatrix } from "./reducer/boardReducer";
interface ISocketModel{
  dispatch: AppDispatch
}

export class SocketModel {
  webSocket: WebSocket;
  playerIdx: number = -1;
  constructor({ dispatch}:ISocketModel) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data);
      const parsedData = parsedMsg.data;
     //console.log(parsedMsg)
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
          const turn = currentPlayer=== this.playerIdx
          dispatch(changeCurrentPlayer({isCurrentPlayer: turn}));
          dispatch(changeTimer({timer: turn}))
          break;
        }
        case 'attack': {
          const {position, currentPlayer, status} = JSON.parse(parsedMsg.data)
          const player = this.playerIdx=== currentPlayer?'enemyField':'ourField';
          dispatch(changeField({position, status, player}))
          Sound.playAudio(status);
          break;
        }
        case 'start_game': {     
          dispatch(changePage({page:'gameField'}))
          dispatch(setWinner({winner:false}));
          const {ships,currentPlayerIndex} = JSON.parse(parsedMsg.data);
          const shipForClient = emptyState();
         // console.log('SOCKET', ships)
          ships.forEach((ship:IShip) => {
                for (let i = 0; i < ship.length; i++) {
                  if (!ship.direction) {
                    shipForClient[ship.position.y][ship.position.x + i] = Cell.Occupied;
                  } else {
                    shipForClient[ship.position.y + i][ship.position.x] = Cell.Occupied;
                  }
               }
              });
        //  console.log( shipForClient)
          //dispatch(setShipsOnCanvas(ships))
          dispatch(addField({field:shipForClient}));
          dispatch(changeCurrentPlayer({isCurrentPlayer: currentPlayerIndex=== this.playerIdx}))
          break;
        }
        case 'reg':{
          const {name, error,errorText} = JSON.parse(parsedData);
          if(error){
            dispatch(addError({error, errorText}));
          }else{
            dispatch(addUserName({name: name}))
            dispatch(addError({error, errorText:''}));
            dispatch(changePage({page:'room'}))
          }
          
          
        break;  
        }
        case 'update_room':{
          const content:IRoom[] = JSON.parse(parsedData);
          dispatch(setRooms({data:content}))
          break;
        }
        case 'update_winners':{
          const winners=JSON.parse(parsedData);
         // console.log(winners)
          dispatch(setWinners({winners}));
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
          setTimeout(()=>{
            dispatch(setWinner({winner: winPlayer===this.playerIdx}))
            dispatch(changePage({page:'finishGame'}))
            dispatch(clearField()); 
            dispatch(cleanShips())
            dispatch(clearMatrix());
          },1000)
            break;
        }
        case 'diconnect':{
          dispatch(setWinner({winner: true}))
          dispatch(changePage({page:'finishGame'}))
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

  // loadField() {
  //   const getField: IMessage = {
  //     type: 'get_field',
  //     data: '',
  //     id: 0
  //   }
  //   this.webSocket.send(JSON.stringify(getField))
  // }

  // loadChatMessages() {
  //   const request: IMessage = {
  //     type: 'chat_history',
  //     data: '',
  //     id: 0
  //   }
  //   this.webSocket.send(JSON.stringify(request));
  // }

  close() {
    this.webSocket.close();
  }

  attack(x: number, y: number,gameId:number) {
    this.sendMessage('attack', JSON.stringify({ x, y ,gameId, indexPlayer: this.playerIdx}))
  }
  randomAttack(gameId:number){
    this.sendMessage('randomAttack', JSON.stringify({ gameId, indexPlayer: this.playerIdx}))
  }

  // sendChatMessage(inputMsg: string) {
  //   const request: IMessage = {
  //     type: 'chat_message',
  //     data: inputMsg,
  //     id: 0
  //   }
  //   this.webSocket.send(JSON.stringify(request));
  // }
  reg(data:IRegData){
    this.sendMessage('reg',JSON.stringify(data))
  }
  createRoom(){
    this.sendMessage('create_room','')
  }
  addUserToRoom(indexRoom: number){
    this.sendMessage('add_user_to_room', JSON.stringify({ indexRoom}))
  }
  startGame(gameId: number, ships: IShip[]){
    this.sendMessage('add_ships', JSON.stringify({gameId, ships, indexPlayer: this.playerIdx}))
  }

  singlePlay(){
    this.sendMessage('single_play','')
  }
  sendMessage(type: string, message: string){
    const request: IMessage = {
      type: type,
      data: message,
      id: 0
    }
    this.webSocket.send(JSON.stringify(request))
  }
}