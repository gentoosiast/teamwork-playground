export interface IRegData{
    name: string,
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

  export interface IUser{
    name: string;
    index: number;
  }

  export interface IUserInitialData{
      name: string,
      index: number,
      isCurrentPlayer: boolean,
      winner: boolean,
      idGames:number[],
  }

  export interface IRoom{
    roomId:number,
    roomUsers: IUser[]
  }
  export interface IRoomsInitialState{
    data: IRoom[];
  }
export interface IFieldsInitialState {
  enemyField: Cell[][],
  ourField: Cell[][],
}
export interface IVector{
  x: number;
  y: number;
}

  export interface IShip {
    position: IVector;
    direction: boolean;
    type:string
}
export interface IMessage {
  type: string,
  data: string,
  id: number
}
import store from "./store/store";
export type AppDispatch = typeof store.dispatch;
