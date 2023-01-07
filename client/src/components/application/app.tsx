import React, { useEffect, useState } from "react";
import { GameField } from '../gameField/game';
import Registration from '../registration/registration';
import { emptyState } from '../../utils/fieldGenerator';
import { SocketModel } from "../../socketModel";
import {IRoom, Cell,AppDispatch} from '../../dto'
import Room from '../room/room';
import FinishPage from '../finishPage/finishPage';
import ChooseShip from '../chooseShip/chooseShip';
import { useDispatch, useSelector } from "react-redux";



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
interface IPage {
  pages: {
    page: string;
  }
}

export function RequestServer() {
  const [socket, setSocket] = useState<SocketModel>(null);
  const [content, setContent]=useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const page = useSelector( (state: IPage) => state.pages.page);

  useEffect(()=>{
    if(page==='room'){
      setContent(<Room socket={socket}/>);
    }
    if(page==='chooseShip'){
      setContent(<ChooseShip socket={socket}/>);
    }
    if(page==='gameField'){
      setContent(<>
      <GameField socket={socket}></GameField>
      </>);
    }
    if(page==='finishGame'){
      setContent(<FinishPage/>)
    }
  },[page]);
  
  useEffect(() => {
    const webSocket = new SocketModel({dispatch});
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
