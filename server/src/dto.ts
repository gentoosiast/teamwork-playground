import { connection } from "websocket";

export interface IClients{
    connection: connection,
    index: number,
    name: string,
  };

export interface IShip {
    position: {
        x: number;
        y: number;
    };
    direction: number;
    length: number;
}
export interface IPlayer {
    connection: connection;
    index: number;
    shipField: Array<Array<number>>;
    ships: IShip[]
  }
  export interface IVector {
    x: number;
    y: number;
  }
  export interface IMessage {
    type: string,
    data: string,
    id: number
  }

  export const enum Cell {
    Empty = 0,
    Unavailable = 1,
    Occupied = 2,
    Shot = 3,
    Killed = 4
  }
  
  export interface IOurField {
    field: Array<Array<Cell>>;
  }
  
  export interface IEnemyField {
    field: Array<Array<Cell>>;
  }