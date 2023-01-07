import React from "react";
import { useSelector } from "react-redux";
import { IUserInitialData } from "../../dto";

interface IUserStore {
    userData: IUserInitialData;
  }
const FinishPage=()=>{
    const winner = useSelector((state: IUserStore) => state.userData.winner)
    return (<p>
        {winner?'You Winner':'You loser'}
        </p>)
}

export default FinishPage;