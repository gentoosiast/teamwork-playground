import {log} from "../CanvasSection";

export default class BoardMatrix {
//	_boardMatrix: number[][];
	private cellsInRow: number;
	private _cellSize: number;
	private boardMatrixEmptyValue: number;
	private boardMatrixFullValue: number;
	private boardMatrixBlockedCell: number;
	private boardMatrixHoverValue: number;
	//private isRotated: boolean;
	//private activeSize: number;
	onFillCells: (fillData: { data: string[], value: number }) => void
	onClearHovered: (value: number) => void
	private board: number[][];
	private hoveredCells: string[];

	constructor(isRotated: boolean, board: number[][]) {
		this.board = board
		//this.isRotated = isRotated
		this.cellsInRow = 10
		this._cellSize = 30
		this.hoveredCells = []
		this.boardMatrixFullValue = 1
		this.boardMatrixBlockedCell = 5
		this.boardMatrixHoverValue = 2
		this.boardMatrixEmptyValue=0
	}

	inPixels(indx: number) {
		return indx * this.cellSize
	}

	getBlockValue() {
		return this.boardMatrixBlockedCell
	}

	isOnBoard(x: number, y: number, activeSize: number, rotated: boolean) {
		const v = !rotated
			? ((x + activeSize) <= this.matrixLength() && y < this.matrixLength() && y >= 0 && x >= 0)
			: ((y + activeSize) <= this.matrixLength()
				&& x < this.matrixLength() && y >= 0 && x >= 0)
		return v
	}

	defineCellValue(val: string) {
		return val === 'occupate' ? this.boardMatrixFullValue :
			val === 'hovered' ? this.boardMatrixHoverValue :
				val === 'empty' ? 99 : 99
	}

	fillCells(val: string, x: number, y: number, activeSize: number, rotated: boolean) {
		const value = this.defineCellValue(val)
		const cells = []
		const dataBoard = []
		for (let i = 0; i < activeSize; i++) {
			const yP = rotated ? y + i : y
			const xP = rotated ? x : x + i
			if (yP < this.cellsInRow && xP < this.cellsInRow) cells.push("+")
		}
		if (cells.length === activeSize) {
			for (let i = 0; i < cells.length; i++) {
				const yP = !rotated ? y : y + i
				const xP = !rotated ? x + i : x
				if (this.board[yP][xP] === this.boardMatrixBlockedCell) return
				//this.boardMatrix[yP][xP] = value
				dataBoard.push(`${yP}-${xP}`)
			}
		}
		this.onFillCells({data: dataBoard, value})
	}

	clearCells() {
		this.onClearHovered(this.boardMatrixEmptyValue)
	}

	matrixLength() {
		return this.board.length
	}

	get boardWidth() {
		return this.cellsInRow * this.cellSize
	}

	get cellSize() {
		return this._cellSize
	}

	valueToCell(y: number, x: number, val: string) {
		this.board[y][x] = val === 'blocked' ? this.boardMatrixBlockedCell : val === 'ship' ? 88 : 99
	}

	updateBoard(board: number[][]) {
		this.board = JSON.parse(JSON.stringify(board))
	}
}