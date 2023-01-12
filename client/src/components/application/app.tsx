import React, { useEffect, useState } from "react";
import { GameField } from '../gameField/game';
import Registration from '../registration/registration';
import { SocketModel } from "../../socketModel";
import { AppDispatch } from '../../dto'
import Room from '../room/room';
import FinishPage from '../finishPage/finishPage';
import ChooseShip from '../chooseShip/chooseShip';
import { useDispatch, useSelector } from "react-redux";
import imageObj from "../../utils/Image";

interface IPage {
  pagesData: {
    page: string;
  }
}

export const App = () => {
  const [socket, setSocket] = useState<SocketModel>(null);
  const [content, setContent]=useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const page = useSelector( (state: IPage) => state.pagesData.page);

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
   // setContent(<ChooseShip socket={socket}/>);
    // return () => {
    //   webSocket.close();
    // }
  }, [])
  
  return (
      <>
        {content}
        {/* <ChooseComponent/> */}
      </>  
  );
}




