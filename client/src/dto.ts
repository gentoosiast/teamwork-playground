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
    data: {
      name: string,
      index: number,
      isCurrentPlayer: boolean,
      winner: boolean,
      idGames:number[],
    },
  }

  export interface IRoom{
    roomId:number,
    roomUsers: IUser[]
  }

  export interface IShip {
    position: {
        x: number;
        y: number;
    };
    direction: number;
    length: number;
}
export interface IMessage {
  type: string,
  data: string,
  id: number
}
import store from "./store/store";
export type AppDispatch = typeof store.dispatch;
