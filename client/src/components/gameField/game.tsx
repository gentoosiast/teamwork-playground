import './game.css';
import React, {useEffect, useRef, useState} from "react";
import { Cell, IFieldsInitialState, IUserInitialData } from '../../dto'
import { SocketModel } from "../../socketModel";
import { useSelector } from 'react-redux';
const styleMap = {
  [Cell.Empty]: '',
  [Cell.Occupied]: 'cell_occupied',
  [Cell.Unavailable]: 'cell_unavailable',
  [Cell.Shot]: 'cell_shot',
  [Cell.Killed]: 'cell_killed'
};


interface IGameFieldProps {
  socket:SocketModel;
}

interface IFieldStore {
  fieldsData: IFieldsInitialState;
}

export function EnemyField(props: IGameFieldProps) {
  const enemyField = useSelector( (state: IFieldStore) => state.fieldsData.enemyField);
  const idGame = useSelector((state: IUserStore) => state.userData.idGames)
  const fieldRef=useRef(null)

  useEffect(()=>{
    const Board=fieldRef.current
  },[])
  return (
    <div className="field">
      {enemyField.map((row, y) => {
        return (
          <div ref={fieldRef}></div>
          // <div className="row" key={y}>
          //   {row.map((cell, x) => {
          //     return (
          //       <div className={"cell" + (` ${styleMap[cell]}`)} key={x} onClick={() => {
          //         props.socket.attack(x, y, idGame[idGame.length-1]);
          //       }}></div>
          //     );
          //   })}
          // </div>
        )
      })}
    </div>
  );
}

export function OurField() {
  const ourField = useSelector( (state: IFieldStore) => state.fieldsData.ourField);
  return (
    <div className="field">
      {ourField.map((row,i) => {
        return (
          <div className="row" key={i}>
            {
              row.map((cell, j) => {
                return (
                  <div className={"cell" + (` ${styleMap[cell]}`)} key={j}></div>
                )
              })
            }
          </div>
        );
      })}
    </div>
  );
}
interface IUserStore {
  userData: IUserInitialData;
}
export function GameField(props: IGameFieldProps) {
  const currentPlayer = useSelector((state: IUserStore) => state.userData.isCurrentPlayer)
  return (
    <div>
      <p>{currentPlayer?'Your Turn':'Next player goes'}</p>
      <OurField></OurField>
      <EnemyField socket={props.socket}></EnemyField>
    </div>
  );
}