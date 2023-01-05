import React from "react";
interface IFinishGame{
    winner: boolean
}
const FinishPage=({winner}:IFinishGame)=>{

    return (<p>
        {winner?'You Winner':'You loser'}
        </p>)
}

export default FinishPage;