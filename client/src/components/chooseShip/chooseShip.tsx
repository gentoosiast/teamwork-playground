import React, {useState} from 'react';
import { IUser } from '../../dto';
import { SocketModel } from '../../socketModel';
interface IChooseShip{
    socket:SocketModel
    gameId: number
}
const ships = [[
    {
      position: {x: 0, y: 0},
      direction: 1,
      length: 3
    },
    {
      position: {x: 0, y: 4},
      direction: 1,
      length: 2
    },
    {
      position: {x: 7, y: 7},
      direction: 0,
      length: 1
    }
  ],[
    {
      position: {x: 3, y: 3},
      direction: 1,
      length: 3
    },
    {
      position: {x: 1, y: 1},
      direction: 1,
      length: 2
    },
    {
      position: {x: 4, y: 8},
      direction: 0,
      length: 1
    }
  ],[
    {
      position: {x: 3, y: 2},
      direction: 1,
      length: 3
    },
    {
      position: {x: 4, y: 6},
      direction: 1,
      length: 2
    },
    {
      position: {x: 1, y: 1},
      direction: 0,
      length: 1
    }
  ],[
    {
      position: {x: 4, y: 5},
      direction: 1,
      length: 3
    },
    {
      position: {x: 0, y: 0},
      direction: 1,
      length: 2
    },
    {
      position: {x: 8, y: 8},
      direction: 0,
      length: 1
    }
  ]];
const ChooseShip=({socket, gameId}:IChooseShip)=>{
    const rand = 0//Math.floor(Math.random()*3)
    console.log(rand)
    return (<>
        Тут людина розставляє свої кораблики, де вони будуть. Потім всі дані по кліку летять на сервер
            <button onClick={()=>socket.startGame( gameId,ships[rand])}>Start game</button> 
        </>)
}

export default ChooseShip;