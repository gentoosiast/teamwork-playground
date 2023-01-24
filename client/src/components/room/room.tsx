import { SocketModel } from '../../socketModel';
import React from 'react';
import { IRoom,IRoomsInitialState,IUserInitialData } from '../../dto';
import { useSelector } from 'react-redux';
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
const Room = ({socket}:IRoomComponent)=>{
    const handlerClick =(ind: number)=>{
        socket.addUserToRoom(ind)
    }
  const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
  const board = useSelector((state: IBoardStore) => state.boardData.boardMatrix)
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
    return(<>
    <p>Hello, {userName}</p>
        <button onClick={()=>socket.createRoom()}>Create Room</button>
        <button onClick={()=>socket.singlePlay({board,shipsToPut:ships})}>Play with Bot</button>
        {roomsComp}
    </>)
}

export default Room;