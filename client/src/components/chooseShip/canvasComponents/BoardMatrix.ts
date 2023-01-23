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
	private boardOccupateValue: number;

	constructor(isRotated: boolean, board: number[][]) {
		this.board = JSON.parse(JSON.stringify(board))
		this.cellsInRow = 10
		this._cellSize = 30
		this.hoveredCells = []
		this.boardMatrixFullValue = 1
		this.boardMatrixBlockedCell = 5
		this.boardMatrixHoverValue = 2
		this.boardMatrixEmptyValue = 0
		this.boardOccupateValue = 7
	}
	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		return this.getCurrentCell(x, y)
	}
fillCell(val:string, x:number, y:number,activeSize:number, isRotated:boolean){
	this.clearCells()
	this.fillCells(val, x, y, activeSize, isRotated)
}

	getBlockValue() {
		return this.boardMatrixBlockedCell
	}
	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this.cellSize), y: Math.floor(y / this.cellSize)}
	}
	isOnBoard(x: number, y: number, activeSize: number, rotated: boolean) {
		const v = !rotated
			? ((x + activeSize) <= this.matrixLength() && y < this.matrixLength() && y >= 0 && x >= 0)
			: ((y + activeSize) <= this.matrixLength()
				&& x < this.matrixLength() && y >= 0 && x >= 0)
		return v
	}

	defineCellValue(val: string) {
		return val === 'occupate' ? this.boardOccupateValue :
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
				if (this.board[yP][xP] === this.boardMatrixBlockedCell) continue
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
	const t=val === 'blocked'
			? this.boardMatrixBlockedCell
			: val === 'ship'
				? 88 : 99
		this.board[y][x] = t
	}

	updateBoard(board: number[][]) {
		this.board = JSON.parse(JSON.stringify(board))
	}
}