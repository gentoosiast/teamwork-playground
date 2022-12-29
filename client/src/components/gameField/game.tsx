import './game.css';
import React, { useEffect, useState } from "react";
import { Cell } from '../../dto'

type FieldState = Cell[][];
const styleMap = {
  [Cell.Empty]: '',
  [Cell.Occupied]: 'cell_occupied',
  [Cell.Unavailable]: 'cell_unavailable',
  [Cell.Shot]: 'cell_shot',
  [Cell.Killed]: 'cell_killed'
};

interface IEnemyFieldProps {
  onAttack: (x: number, y: number) => void;
  field: Array<Array<Cell>>;
}

interface IOurFieldProps {
  field: Array<Array<Cell>>;
}

interface IGameFieldProps {
  onAttack: (x: number, y: number) => void;
  enemyField: Array<Array<Cell>>;
  ourField: Array<Array<Cell>>;
  isCurrentPlayer: boolean
}

export function EnemyField(props: IEnemyFieldProps) {
  return (
    <div className="field">
      {props.field.map((row, y) => {
        return (
          <div className="row" key={y}>
            {row.map((cell, x) => {
              return (
                <div className={"cell" + (` ${styleMap[cell]}`)} key={x} onClick={() => {
                  props.onAttack(x, y);
                }}></div>
              );
            })}
          </div>
        )
      })}
    </div>
  );
}

export function OurField(props: IOurFieldProps) {
  return (
    <div className="field">
      {props.field.map((row,i) => {
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

export function GameField(props: IGameFieldProps) {
  return (
    <div>
      <p>{props.isCurrentPlayer?'Your Turn':'Next player goes'}</p>
      <OurField field = {props.ourField}></OurField>
      <EnemyField onAttack={props.onAttack} field={props.enemyField}></EnemyField>
    </div>
  );
}