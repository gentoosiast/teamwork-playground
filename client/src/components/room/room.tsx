import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import { ButtonRooms } from '../styledComponents/buttons';
import RoomList from './roomList';
import { generalColor,backGroundColorOpacity } from '../../styleConst';
import {IShipsStore} from "../../reducer/shipsReducer";
import {IBoardStore} from "../../reducer/boardReducer";
import Wrapper from '../styledComponents/wrapper'
import Content from '../styledComponents/content';
import WinnerList from './winnerList';
interface IUserStore {
    userData: IUserInitialData;
}

interface IRoomComponent {
    socket:SocketModel,
}
interface IRoomsStore {
    roomsData: IRoomsInitialState;
  }
// const Header = styled.div`
//     width:500px;    
//     background-color: ${backGroundColorOpacity} ;
//     padding: 50px;
//     border-radius: 10px;
//     border: 1px solid ${generalColor};
// `
const Room = ({socket}:IRoomComponent)=>{

  const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
  const board = useSelector((state: IBoardStore) => state.boardData.boardMatrix)
   const userName = useSelector( (state: IUserStore) => state.userData.name);
    return(
        <Wrapper>
            <Content width={500}>
                <div>
                    <SubTitle>Welcome to Battleship, {userName}</SubTitle>
                    <SubTitle>What game do you choose?</SubTitle> 
                    <ButtonRooms onClick={()=>socket.singlePlay({board,shipsToPut:ships})}>Play with Bot</ButtonRooms>  
                    <ButtonRooms onClick={()=>socket.createRoom()}>Create Room</ButtonRooms>
                </div>
            </Content>
        <RoomList socket={socket}/>
        <WinnerList/>
    </Wrapper>)
}
export default Room;