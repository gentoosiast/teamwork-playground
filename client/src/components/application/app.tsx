import React, { useEffect, useMemo, useState } from "react";
import { IMessage } from "../../../../interface/IMessage"
import { IVector } from '../../../../interface/IVector';
import { GameField } from '../gameField/game';
import Registration from '../registration/registration';
import { emptyState } from '../../../../interface/fieldGenerator';
import { Cell } from "../../../../interface/IField";
import { SocketModel } from "../../socketModel";
import {IRegData, IRoom, IUser} from '../../dto'
import Room from '../room/room';
import ChooseShip from '../chooseShip/chooseShip';
import ChooseComponent from "../chooseShip/ChooseComponent";

interface IAppProps {
  onClick: () => void;
  text: string;
}

interface ICheckBoxProps {
  onClick: (checked: boolean) => void;
  text: string;
}

export const App = () => {

  return (
    <>
      {/* <button
        onClick={() => {
          console.log("test of the button");
          props.onClick();
        }}
      >
        click me {props.text}
      </button>
      <CheckBox onClick={() => { }} text="checkbox string" /> */}
      <RequestServer></RequestServer>

      {/* <RequestServer1></RequestServer1> */}
    </>
  );
}

// export function CheckBox(props: ICheckBoxProps) {
//   const [isChecked, setChecked] = useState(false);
//   return (
//     <div>
//       <span>{props.text}</span>
//       <button
//         onClick={() => {
//           setChecked(!isChecked);
//           props.onClick(isChecked);
//         }}
//       >
//         {isChecked ? "+" : "-"}
//       </button>
//     </div>
//   );
// }


export function RequestServer() {
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState<SocketModel>(null);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<string>>([]);
  const [playerIdx, setPlayerIdx] = useState(-1);
  const [ships, setShips] = useState([]);
  const [user, setUserData]=useState<IUser>({name:'', index:-1});
  const [rooms, setRoom] = useState<IRoom[]>([])
  const [idGame, setIdGame] = useState(-1);
  const [enemyField, setEnemyField] = useState<Array<Array<Cell>>>(emptyState());
  const [ourField, setOurField] = useState<Array<Array<Cell>>>(emptyState());
  const [content, setContent]=useState(null);
  const [page, setPage]=useState('reg');
  const fieldWithShips = useMemo(() => {
    const result = ourField.map((row) => row.map((cell) => {
      return cell;
    }));
    ships.forEach((ship) => {
      for (let i = 0; i < ship.length; i += 1) {
        if (ship.direction === 0) {
          result[ship.position.y][ship.position.x + i] = Cell.Occupied;
        } else {
          result[ship.position.y + i][ship.position.x] = Cell.Occupied;
        }
      }
    });
    return result;
  }, [ourField, ships]);
  
  useEffect(()=>{
    console.log('app',rooms)
    if(page==='room'){
      console.log('regUser', socket)
      setContent(<Room rooms={rooms} socket={socket} user={user}/>);
    }
    if(page==='chooseShip'){
      setContent(<ChooseShip user={user} socket={socket} gameId={idGame}/>);
    }
    if(page==='gameField'){
      setContent(<>
      <GameField onAttack={(x, y) => {
        socket.attack(x, y, idGame);
      }} enemyField={enemyField} ourField={fieldWithShips}></GameField>
       <div>player index: {playerIdx}</div>
      </>);
    }
  },[page,rooms, enemyField, fieldWithShips])
  useEffect(() => {
    const webSocket = new SocketModel({setMessages, setEnemyField, setOurField, setPlayerIdx, setShips, setPage,setUserData,setRoom,setIdGame});
    setSocket(webSocket);
    setContent(<Registration socket={webSocket}/>);

    // return () => {
    //   webSocket.close();
    // }
  }, [])
  
 
  


  return (
      <>
        {content}
        {/* <ChooseComponent/> */}
      </>  
    // <div>
    //   <Registration onSubmit={registration}/>
    //   <GameField onAttack={(x, y) => {
    //     socket.attack(x, y);
    //   }} enemyField={enemyField} ourField={fieldWithShips}></GameField>
    //   <span>{response}</span>
    //   <input className="bg-sky-400 placeholder-white text-center placeholder:opacity-50 m-5 p-2 rounded-md" value={inputMsg} onChange={(e) => {
    //     setInputMsg(e.target.value)
    //   }} type="text" placeholder="something" />
    //   <button
    //     onClick={() => {
    //       socket.sendChatMessage(inputMsg);
    //       setInputMsg('');
    //       // fetch("http://localhost:3000")
    //       //   .then((data) => data.text())
    //       //   .then((data) => setResponse(data));
    //     }}
    //   >
    //     New button
    //   </button>
    //   <div>
    //     {messages.map(msg => {
    //       return (<div>
    //         {msg}
    //       </div>)
    //     })}
    //   </div>
    //   <div>player index: {playerIdx}</div>
    // </div>
  );
}

// export function RequestServer1() {
//   const [response, setResponse] = useState("Loading...");
//   useEffect(() => {
//     const tID = setTimeout(() => {
//       fetch("http://localhost:3000")
//         .then((data) => data.text())
//         .then((data) => setResponse(data));
//     }, 2000);
//     return () => {
//       clearTimeout(tID);
//     };
//   }, []);
//   return (
//     <div>
//       <span>{response}</span>
//     </div>
//   );
// }
