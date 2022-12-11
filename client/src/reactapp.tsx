import React, { useEffect, useState } from "react";
import { IMessage } from "../../interface/IMessage"
import { IVector } from '../../interface/IVector';
import { GameField } from './game';
import { emptyState } from '../../interface/fieldGenerator';
import { Cell } from "../../interface/IField";

interface IAppProps {
  onClick: () => void;
  text: string;
}

interface ICheckBoxProps {
  onClick: (checked: boolean) => void;
  text: string;
}

export function App(props: IAppProps) {
  return (
    <div>
      <button
        onClick={() => {
          console.log("test of the button");
          props.onClick();
        }}
      >
        click me {props.text}
      </button>
      <CheckBox onClick={() => { }} text="checkbox string" />
      <RequestServer></RequestServer>
      <RequestServer1></RequestServer1>
    </div>
  );
}

export function CheckBox(props: ICheckBoxProps) {
  const [isChecked, setChecked] = useState(false);
  return (
    <div>
      <span>{props.text}</span>
      <button
        onClick={() => {
          setChecked(!isChecked);
          props.onClick(isChecked);
        }}
      >
        {isChecked ? "+" : "-"}
      </button>
    </div>
  );
}

export function RequestServer() {
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState<WebSocket>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000')
    websocket.onmessage = (msg) => {
      const parsedMsg: IMessage = JSON.parse(msg.data)
      console.log(parsedMsg.type);

      switch (parsedMsg.type) {
        case 'chat_message': {
          console.log(parsedMsg.data)
          setMessages((last) => {
            return [parsedMsg.data, ...last]
          })
          break;
        }
        case 'chat_history': {
          const msgList: Array<string> = JSON.parse(parsedMsg.data)
          console.log(msgList)
          setMessages(msgList.reverse())
          break;
        }
        case 'attack': {
          const position: IVector = JSON.parse(parsedMsg.data)
          console.log(position)
          setEnemyField((last) => {
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
      setSocket(websocket)
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
    return () => {
      websocket.close()
    }
  }, [])

  const [enemyField, setEnemyField] = useState<Array<Array<Cell>>>(emptyState());
  return (
    <div>
      <GameField onAttack={(x, y) => {
        const request: IMessage = {
          type: 'attack',
          data: JSON.stringify({ x, y }),
          id: 0
        }
        socket.send(JSON.stringify(request))
      }} enemyField={enemyField}></GameField>
      <span>{response}</span>
      <input className="bg-sky-400 placeholder-white text-center placeholder:opacity-50 m-5 p-2 rounded-md" value={inputMsg} onChange={(e) => {
        setInputMsg(e.target.value)
      }} type="text" placeholder="something" />
      <button
        onClick={() => {
          const request: IMessage = {
            type: 'chat_message',
            data: inputMsg,
            id: 0
          }
          socket.send(JSON.stringify(request))

          setInputMsg('')

          // fetch("http://localhost:3000")
          //   .then((data) => data.text())
          //   .then((data) => setResponse(data));
        }}
      >
        New button
      </button>
      <div>
        {messages.map(msg => {
          return (<div>
            {msg}
          </div>)
        })}
      </div>
    </div>
  );
}

export function RequestServer1() {
  const [response, setResponse] = useState("Loading...");
  useEffect(() => {
    const tID = setTimeout(() => {
      fetch("http://localhost:3000")
        .then((data) => data.text())
        .then((data) => setResponse(data));
    }, 2000);
    return () => {
      clearTimeout(tID);
    };
  }, []);
  return (
    <div>
      <span>{response}</span>
    </div>
  );
}
