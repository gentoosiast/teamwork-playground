import './game.css';
import React, { useEffect, useState } from "react";

const enum Cell {
  Empty,
  Unavailable,
}

type FieldState = Cell[][];

interface IEnemyFieldProps {
  onAttack: (x: number, y: number) => void;
}

interface IGameFieldProps {
  onAttack: (x: number, y: number) => void;
}

function emptyState() {
  const initialState: Cell[][] = [];
  for (let i = 0; i < 9; i += 1) {
    const row: Cell[] = [];
    for (let j = 0; j < 9; j += 1) {
      row.push(Cell.Empty);
    }
    initialState.push(row);
  }
  return initialState;
}

export function EnemyField(props: IEnemyFieldProps) {
  const [enemyField, setEnemyField] = useState<FieldState>(emptyState());
  return (
    <div className="field">
      {enemyField.map((row, y) => {
        return (
        <div className="row">
          {row.map((cell, x) => {
            return (
              <div className={"cell" + (cell === Cell.Unavailable ? " cell_unavailable" : "")} onClick={() => {
                props.onAttack(x, y);
              }}></div>
            );
          })}
        </div>
      )})}
    </div>
  );
}

export function OurField() {
  const [ourField, setOurField] = useState<FieldState>(emptyState());
  return (
    <div className="field">
      {ourField.map((row) => {
        return (
          <div className="row">
            {
              row.map((cell) => {
                return (
                  <div className={"cell" + (cell === Cell.Unavailable ? " cell_unavailable" : "")}></div>
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
      <OurField></OurField>
      <EnemyField onAttack={props.onAttack}></EnemyField>
    </div>
  );
}