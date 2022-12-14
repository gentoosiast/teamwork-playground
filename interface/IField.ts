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