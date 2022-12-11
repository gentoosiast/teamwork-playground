import './game.css';
import React, { useEffect, useState } from "react";
import { Cell } from './../../interface/IField'
import { emptyState } from './../../interface/fieldGenerator';

type FieldState = Cell[][];

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
}

export function EnemyField(props: IEnemyFieldProps) {
  return (
    <div className="field">
      {props.field.map((row, y) => {
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
        )
      })}
    </div>
  );
}

export function OurField(props: IOurFieldProps) {
  return (
    <div className="field">
      {props.field.map((row) => {
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
      <OurField field = {props.ourField}></OurField>
      <EnemyField onAttack={props.onAttack} field={props.enemyField}></EnemyField>
    </div>
  );
}