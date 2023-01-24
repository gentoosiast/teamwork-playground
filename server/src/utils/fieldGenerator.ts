import { Cell } from '../dto';

export function emptyState() {
  const initialState: Cell[][] = [];
  for (let i = 0; i < 10; i += 1) {
    const row: Cell[] = [];
    for (let j = 0; j < 10; j += 1) {
      row.push(Cell.Empty);
    }
    initialState.push(row);
  }
  return initialState;
}
