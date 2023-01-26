import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import {backGroundColor, generalColor} from '../../styleConst';
import SubTitle from '../styledComponents/subTitle';
import { useSelector } from 'react-redux';
import { ButtonRooms } from '../styledComponents/buttons';
import { SocketModel } from '../../socketModel';
import styled from 'styled-components';
interface IRoomsStore {
    roomsData: IRoomsInitialState;
}
interface IRoomsList{
    socket:SocketModel
}
const RoomsContainer =styled.div`
    padding: 50px;
    width:330px;
    background-color: ${backGroundColor} ;
    max-height: 90vh;
    border-radius: 10px;
    border: 1px solid ${generalColor};
    overflow: auto;
`
const RoomList = ({socket}:IRoomsList)=>{
    const rooms = useSelector((state: IRoomsStore) => state.roomsData.data);
    const handlerClick =(ind: number)=>{
        socket.addUserToRoom(ind)
    }
    const content = !rooms.length?'':
    (<RoomsContainer>
        <SubTitle>Rooms in game</SubTitle>
        {rooms.map((it,ind)=>{
            return(
            <div key={ind}>
                User in Room: {it.roomUsers.map(i=>i.name).join()}
                <ButtonRooms onClick={()=>handlerClick(it.roomId)}>add to Room</ButtonRooms>
            </div>
            )
        })}
    </RoomsContainer>);
    
    return  (<>
        {content}        
    </>);
}
export default RoomList;