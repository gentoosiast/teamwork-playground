import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom, IUser } from '../../dto';

interface IRoomComponent {
    socket:SocketModel,
    rooms: IRoom[],
    user:IUser
}
const Room = ({socket,rooms,user}:IRoomComponent)=>{
    console.log(user, rooms)
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
   
    return(<>
    <p>Hello, {user.name}</p>
        <button onClick={()=>socket.createRoom()}>Create Room</button>
        <button>Add to Room</button>   
        {roomsComp}
    </>)
}

export default Room;