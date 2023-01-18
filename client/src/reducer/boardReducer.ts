import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IBoardStore {
	boardData: IShipsInitialState;
}

export interface IShipsInitialState {
	cellsInRow: number,
	boardMatrix: number[][],
	_moveAdded:boolean,
	_ckickAdded:boolean
}

function createEmptyMatrix(cellsInRow: number) {
	const matrix = []
	for (let i = 0; i < cellsInRow; i++) {
		const row = []
		for (let j = 0; j < cellsInRow; j++) {
			row.push(99)
		}
		matrix.push(row)
	}
	return matrix
}

function emptyMatrix(len: number) {
	return new Array(10).fill(new Array(10).fill(0))
}

const initialState: IShipsInitialState = {
	cellsInRow: 10,
	boardMatrix: emptyMatrix(10),
	_moveAdded:false,
	_ckickAdded:false
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
		fillAreaCells(state, action: PayloadAction<{data:string[],value:number}>){
			action.payload.data.forEach(c=>{
				const d=c.split('-')
				const y=d[0]
				const x=d[1]
				state.boardMatrix[+y][+x]=action.payload.value
			})
		},
		fillCells(state, action: PayloadAction<fillCellsType>) {
			action.payload.data.forEach(cell => {
				const [y, x] = cell.split('-')
				state.boardMatrix[+y][+x] = action.payload.value
			})
			console.log("stBorad",state.boardMatrix)
		},
		clearHovered(state, action: PayloadAction<number>) {
			state.boardMatrix.map((row: number[]) => {
				return row.map((cell, i) => {
					if (cell !== 5) row[i] = action.payload
				})
			})
		},
		setMoveAdded(state){
			state._moveAdded=true
		},
	}
});

const {actions, reducer} = boardReducer;

export const {fillCells,clearHovered,setMoveAdded,fillAreaCells} = actions;

export default reducer;