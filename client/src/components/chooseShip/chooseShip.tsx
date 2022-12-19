import React, {useState} from 'react';
import { IUser } from '../../dto';
import { SocketModel } from '../../socketModel';
interface IChooseShip{
    socket:SocketModel
    gameId: number
}
const ChooseShip=({socket, gameId}:IChooseShip)=>{

    return (<>
        Тут людина розставляє свої кораблики, де вони будуть. Потім всі дані по кліку летять на сервер
            <button onClick={()=>socket.startGame( gameId)}>Start game</button> 
        </>)
}

export default ChooseShip;