import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Wrapper from '../styledComponents/wrapper'

interface IUserStore {
    userData: IUserInitialData;
}

interface IRoomComponent {
    socket:SocketModel,
}
interface IRoomsStore {
    roomsData: IRoomsInitialState;
  }

const Room = ({socket}:IRoomComponent)=>{
    const handlerClick =(ind: number)=>{
        socket.addUserToRoom(ind)
    }
    const rooms = useSelector((state: IRoomsStore) => state.roomsData.data)
    const roomsComp = !rooms.length?'emptyRooms':
    (<><h2>Rooms</h2>
        {rooms.map((it,ind)=>{
            return(
            <div key={ind}>
                Rooom id={it.roomId}
                Users: {it.roomUsers.map(i=>i.name).join()}
                <button onClick={()=>handlerClick(it.roomId)}>add to Room</button>
            </div>
            )
        })}
    </>);
   const userName = useSelector( (state: IUserStore) => state.userData.name);
    return(<Wrapper>
        <>
            <p>Hello, {userName}</p>
            <button onClick={()=>socket.createRoom()}>Create Room</button>
            <button onClick={()=>socket.singlePlay()}>Play with Bot</button>   
            {roomsComp}
        </>
        
    </Wrapper>)
}

export default Room;