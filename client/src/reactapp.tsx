import React, { useEffect, useState } from "react";
import { IMessage } from "../../interface/IMessage"
import { IVector } from '../../interface/IVector';
import { GameField } from './game';
import { emptyState } from '../../interface/fieldGenerator';
import { Cell } from "../../interface/IField";
import { SocketModel } from "./socketModel";

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
  const [socket, setSocket] = useState<SocketModel>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    const webSocket = new SocketModel({setMessages, setEnemyField});
    setSocket(webSocket);
    return () => {
      webSocket.close();
    }
  }, [])

  const [enemyField, setEnemyField] = useState<Array<Array<Cell>>>(emptyState());
  return (
    <div>
      <GameField onAttack={(x, y) => {
        socket.attack(x, y);
      }} enemyField={enemyField}></GameField>
      <span>{response}</span>
      <input className="bg-sky-400 placeholder-white text-center placeholder:opacity-50 m-5 p-2 rounded-md" value={inputMsg} onChange={(e) => {
        setInputMsg(e.target.value)
      }} type="text" placeholder="something" />
      <button
        onClick={() => {
          socket.sendChatMessage(inputMsg);
          setInputMsg('');
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
