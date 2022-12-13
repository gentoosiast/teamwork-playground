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
        socket.addUserToRoom(user,ind)
    }
    const roomsComp = !rooms.length?'emptyRooms':
    (<><h2>Rooms</h2>
        {rooms.map(it=>{
            const isUserInRoom = Boolean(it.roomUsers.find(i=>i.index==user.index))
            return(
            <div >
                Rooom id={it.roomId}
                Users: {it.roomUsers.map(i=>i.name).join()}
                <button onClick={()=>handlerClick(it.roomId)}>{isUserInRoom?'remove room':'add to Room'}</button>
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