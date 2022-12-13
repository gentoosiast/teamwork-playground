import React, { useState } from 'react';
import {IRegData} from '../../dto'
import { SocketModel } from '../../socketModel';
interface IRegistratoon {
    socket:SocketModel
}

const Registration = ({socket}:IRegistratoon)=>{
    const [data, setData] = useState<IRegData>({name:''})
    const handlerName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData({...data, name: e.target.value})
    }

    return (<>
        <input onChange={handlerName} type="text" placeholder="login" value={data.name}/><br></br>

        <button onClick={()=>socket.reg(data)}>Submit</button> 
    </>)
} 

export default Registration;