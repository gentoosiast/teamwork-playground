import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Title from '../styledComponents/title';
import SubTitle from '../styledComponents/subTitle';
import { ButtonRooms } from '../styledComponents/buttons';
import RoomList from './roomList';

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

`

const Header = styled.div`
    width: 100%;
    height: 200px;
    background-color: #fffebf9d ;
`
const HeaderContainer=styled.div`
    margin: 0 100px;
`
const Main =styled.div`
    margin: 50px 100px;
    width:300px;
    background-color: #fffebf ;
    max-height: 400px;
    overflow: auto;
`
const Room = ({socket}:IRoomComponent)=>{
   const userName = useSelector( (state: IUserStore) => state.userData.name);
    return(<Wrapper>
        <Header>
            <HeaderContainer>
                <SubTitle>Welcome to Battleship, {userName}</SubTitle>
                <SubTitle>What game do you choose?</SubTitle>
                <ButtonRooms onClick={()=>socket.createRoom()}>Create Room</ButtonRooms>
                <ButtonRooms onClick={()=>socket.singlePlay()}>Play with Bot</ButtonRooms>  
            </HeaderContainer>
                       
        </Header>
        <Main>
            <RoomList socket={socket}/>
        </Main>
       
    </Wrapper>)
}

export default Room;