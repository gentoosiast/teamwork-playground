import { Cell } from "../../interface/IField";
import { IMessage } from "../../interface/IMessage";

export class SocketModel {
  webSocket: WebSocket;
  constructor({setMessages, setEnemyField, setOurField}) {
    const websocket = new WebSocket('ws://localhost:3000')
    this.webSocket = websocket;
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data)
      console.log(parsedMsg.type);

      switch (parsedMsg.type) {
        case 'chat_message': {
          console.log(parsedMsg.data)
          setMessages((last) => {
            return [parsedMsg.data, ...last]
          })
          // this.onMesssage(parsedMsg.data);
          break;
        }
        case 'chat_history': {
          const msgList: Array<string> = JSON.parse(parsedMsg.data)
          console.log(msgList)
          setMessages(msgList.reverse())
          break;
        }
        case 'attack': {
          const {position, currentPlayer}: IVector = JSON.parse(parsedMsg.data)
          console.log(position)
          const setField = [setEnemyField, setOurField][currentPlayer]
          setField((last) => {
            return last.map((row, y) => {
              return row.map((cell, x) => {
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
        default:
          break;
      }
      console.log(msg)
      // setMessages((last) => {
      //   return [msg.data, ...last]
      // })
    }
    websocket.onopen = () => {
      console.log('connected')
      // setSocket(websocket)
      const request: IMessage = {
        type: 'chat_history',
        data: '',
        id: 0
      }
      websocket.send(JSON.stringify(request))
      const getField: IMessage = {
        type: 'get_field',
        data: '',
        id: 0
      }
      websocket.send(JSON.stringify(getField))
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

  attack(x: number, y: number) {
    const request: IMessage = {
      type: 'attack',
      data: JSON.stringify({ x, y }),
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
}