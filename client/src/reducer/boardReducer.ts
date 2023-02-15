import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IBoardStore {
	boardData: IShipsInitialState;
}

export interface IShipsInitialState {
	cellsInRow: number,
	cellSize: number,
	boardMatrix: number[][],
	_moveAdded: boolean,
	_ckickAdded: boolean,
	enemyOccupiedData: {position: { x: number, y: number }, status: string },
	ourOccupiedData: {position: { x: number, y: number }, status: string }
}

function emptyMatrix(len: number) {
	return new Array(len).fill(new Array(len).fill(0))
}

const initialState: IShipsInitialState = {
	cellsInRow: 10,
	cellSize: 30,
	boardMatrix: emptyMatrix(10),
	_moveAdded: false,
	_ckickAdded: false,
	enemyOccupiedData: null,
	ourOccupiedData: null
	//	return createEmptyMatrix(this.cellsInRow)

};
type fillCellsType = {
	data: Array<string>,
	value: number
}
const boardReducer = createSlice({
	name: "boardData",
	initialState,
	reducers: {
		ourOccupied(state, action: PayloadAction<{ position: { x: number, y: number }, status: string }>) {
			state.ourOccupiedData = action.payload
		},
		enemyOccupied(state, action: PayloadAction<{ position: { x: number, y: number }, status: string }>) {
			state.enemyOccupiedData = action.payload
		},
		fillAreaCells(state, action: PayloadAction<{ data: string[], value: number }>) {
			action.payload.data.forEach(c => {
				const d = c.split('-')
				const y = d[0]
				const x = d[1]
				state.boardMatrix[+y][+x] = action.payload.value
			})
		},
		fillCells(state, action: PayloadAction<fillCellsType>) {
			action.payload.data.forEach(cell => {
				const [y, x] = cell.split('-')
				state.boardMatrix[+y][+x] = action.payload.value
			})
			//	console.log("stBorad",state.boardMatrix)
		},
		clearHovered(state, action: PayloadAction<number>) {
			state.boardMatrix.map((row: number[]) => {
				return row.map((cell, i) => {
					if (cell !== 5) row[i] = action.payload
				})
			})
		},
		setMoveAdded(state) {
			state._moveAdded = true
		},
		clearMatrix(state){
			state.boardMatrix= emptyMatrix(10);
		}
	}
});

const {actions, reducer} = boardReducer;

export const {
	fillCells, clearHovered, setMoveAdded, fillAreaCells,
	ourOccupied, enemyOccupied,clearMatrix
} = actions;

export default reducer;