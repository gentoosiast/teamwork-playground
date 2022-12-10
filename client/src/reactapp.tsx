import React, { useEffect, useState } from "react";


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
      console.log(msg)
      setMessages((last) => {
        return [msg.data, ...last]
      })
    }
    websocket.onopen = () => {
      console.log('connected')
      setSocket(websocket)
      websocket.send('hello from react')
    }
    return () => {
      websocket.close()
    }
  }, [])

  return (
    <div>
      <span>{response}</span>
      <input value={inputMsg} onChange={(e) => {
        setInputMsg(e.target.value)
      }} type="text" placeholder="something" />
      <button
        onClick={() => {
          socket.send(inputMsg)
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
