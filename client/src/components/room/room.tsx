import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Setting  from '../styledComponents/setting';
import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import { ButtonRooms } from '../styledComponents/buttons';
import RoomList from './roomList';
import { generalColor,backGroundColor } from '../../styleConst';
import {IShipsStore} from "../../reducer/shipsReducer";
import {IBoardStore} from "../../reducer/boardReducer";

interface IUserStore {
    userData: IUserInitialData;
}

interface IRoomComponent {
    socket:SocketModel,
}
interface IRoomsStore {
    roomsData: IRoomsInitialState;
  }
const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    height:  100%;
    padding: 50px;
`

const Header = styled.div`
    width:500px;
    
    background-color: ${backGroundColor} ;
    padding: 50px;
    border-radius: 10px;
    border: 1px solid ${generalColor};
`
const HeaderContainer=styled.div`

`
const Main =styled.div`
    /* margin: 50px 100px;
    width:330px;
    background-color: ${backGroundColor} ;
    max-height: 90vh;
    border-radius: 10px;
    border: 1px solid ${generalColor};
    overflow: auto; */
`
const Room = ({socket}:IRoomComponent)=>{

  const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
  const board = useSelector((state: IBoardStore) => state.boardData.boardMatrix)
   const userName = useSelector( (state: IUserStore) => state.userData.name);
    return(
        <Wrapper>
            <Header>
                <HeaderContainer>
                    <SubTitle>Welcome to Battleship, {userName}</SubTitle>
                    <SubTitle>What game do you choose?</SubTitle> 
                    <ButtonRooms onClick={()=>socket.singlePlay({board,shipsToPut:ships})}>Play with Bot</ButtonRooms>  
                    <ButtonRooms onClick={()=>socket.createRoom()}>Create Room</ButtonRooms>
                </HeaderContainer>
            </Header>
        <RoomList socket={socket}/>
    </Wrapper>)
}
export default Room;