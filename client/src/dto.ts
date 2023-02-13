export interface IRegData{
    name: string,
    password: string
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
      error: boolean,
      errorText: string,
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
  enemyOccupiedCell :{position:{x:number,y:number},status:string},
  ourOccupiedCell :{position:{x:number,y:number},status:string}
}
export interface IVector{
  x: number;
  y: number;
}

export type ShipType = 'small'|'medium'|'large'|'huge';

  export interface IShip {
    position: IVector;
    direction: boolean;
    type:ShipType;
    length: number;
}
export interface IMessage {
  type: string,
  data: string,
  id: number
}
import store from "./store/store";
export type AppDispatch = typeof store.dispatch;

export enum ShipsSizes {
	small = 1,
	medium,
	large,
	huge
}

export type tShipCanvas = { 
  type: ShipType,
  isRotate: boolean,
  xC: number,
  yC: number 
}

export interface ISetting {
  volume: number,
  isSound: boolean
}

export interface ITimer {
	timerData: {
		timer: boolean
	}
}

export interface IWinner{
  name: string;
  wins: number
}

export interface IWinnersState{
  winners:IWinner[]
}