import React, {useState} from 'react';
import { IUser } from '../../dto';
import { SocketModel } from '../../socketModel';
interface IChooseShip{
    socket:SocketModel
    user:IUser
    gameId: number
}
const ChooseShip=({socket, user, gameId}:IChooseShip)=>{

    return (<>
        Тут людина розставляє свої кораблики, де вони будуть. Потім всі дані по кліку летять на сервер
            <button onClick={()=>socket.startGame(user, gameId)}>Start game</button> 
        </>)
}

export default ChooseShip;