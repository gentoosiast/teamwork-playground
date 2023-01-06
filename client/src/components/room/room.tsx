import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';

interface IUserStore {
    userData: IUserInitialData;
}

interface IRoomComponent {
    socket:SocketModel,
    rooms: IRoom[],
}
const Room = ({socket,rooms}:IRoomComponent)=>{
    const handlerClick =(ind: number)=>{
        socket.addUserToRoom(ind)
    }
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
   const userName = useSelector( (state: IUserStore) => state.userData.data.name);
    return(<>
    <p>Hello, {userName}</p>
        <button onClick={()=>socket.createRoom()}>Create Room</button>
        <button onClick={()=>socket.singlePlay()}>Play with Bot</button>   
        {roomsComp}
    </>)
}

export default Room;