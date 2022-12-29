import React, { useEffect, useMemo, useState } from "react";
import { GameField } from '../gameField/game';
import Registration from '../registration/registration';
import { emptyState } from '../../utils/fieldGenerator';
import { SocketModel } from "../../socketModel";
import {IRoom, IUser,Cell} from '../../dto'
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
  const [socket, setSocket] = useState<SocketModel>(null);
  const [playerIdx, setPlayerIdx] = useState(-1);
  const [user, setUserData]=useState<IUser>({name:'', index:-1});
  const [rooms, setRoom] = useState<IRoom[]>([])
  const [idGame, setIdGame] = useState(-1);
  const [enemyField, setEnemyField] = useState<Array<Array<Cell>>>(emptyState());
  const [ourField, setOurField] = useState<Array<Array<Cell>>>(emptyState());
  const [content, setContent]=useState(null);
  const [page, setPage]=useState('reg');
  const [isCurrentPlayer, setCurrentPlayer] = useState(false)
  

  useEffect(()=>{
    if(page==='room'){
      setContent(<Room rooms={rooms} socket={socket} user={user}/>);
    }
    if(page==='chooseShip'){
      setContent(<ChooseShip socket={socket} gameId={idGame}/>);
    }
    if(page==='gameField'){
      setContent(<>
      <GameField isCurrentPlayer={isCurrentPlayer} onAttack={(x, y) => {
        socket.attack(x, y, idGame);
      }} enemyField={enemyField} ourField={ourField}></GameField>
       <div>player index: {playerIdx}</div>
      </>);
    }
  },[page,rooms, enemyField, ourField,isCurrentPlayer])
  useEffect(() => {
    const webSocket = new SocketModel({ setEnemyField, setOurField, setPlayerIdx,  setPage,setUserData,setRoom,setIdGame,setCurrentPlayer});
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
