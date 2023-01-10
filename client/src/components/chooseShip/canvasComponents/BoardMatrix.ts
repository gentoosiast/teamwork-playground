import {ShipsSizes} from "../ChooseComponent";
import ShipsController from "./ShipsController";

export default class BoardMatrix {
	_boardMatrix: number[][];
	private shipsController: ShipsController;
	private cellsInRow: number;
	private _cellSize: number;
	private boardMatrixEmptyValue: number;
	private boardMatrixFullValue: number;
	private boardMatrixBlockedCell: number;
	private boardMatrixHoverValue: number;

	constructor(shipsController: ShipsController) {
		this._boardMatrix = []
		this.shipsController = shipsController
		this.cellsInRow = 10
		this._cellSize = 30
		this.boardMatrixEmptyValue = 99
		this.boardMatrixFullValue = 1
		this.boardMatrixBlockedCell = 5
		this.boardMatrixHoverValue = 2
	}

	inPixels(indx: number) {
		return indx * this.cellSize
	}

	isOnBoard(x: number, y: number) {
		if (!this.shipsController.isRotated) {
			return (x + this.shipsController.activeShipSize) <= this.matrixLength()
				&& y < this.matrixLength() && y >= 0 && x >= 0
		} else {
			return (y + this.shipsController.activeShipSize) <= this.matrixLength()
				&& x < this.matrixLength() && y >= 0 && x >= 0
		}

	}

	isInMatrix(value: number) {
		return value >= 0 && value < this.boardMatrix.length
	}

	createEmptyMatrix() {
		for (let i = 0; i < this.cellsInRow; i++) {
			const row = []
			for (let j = 0; j < this.cellsInRow; j++) {
				row.push(99)
			}
			this.boardMatrix.push(row)
		}
	}

	fillCells(val: string, x: number, y: number) {
		const value = val === 'occupate' ? this.boardMatrixFullValue :
			val === 'hovered' ? this.boardMatrixHoverValue :
				val === 'empty' ? this.boardMatrixEmptyValue : 99
		const cells = []
		for (let i = 0; i < this.shipsController.activeShipSize; i++) {
			if (this.shipsController.isRotated) {
				if (y + i < this.cellsInRow && x < this.cellsInRow) cells.push("+")
			} else {
				if (y < this.cellsInRow && x + i < this.cellsInRow) cells.push("+")
			}
		}
		if (cells.length === this.shipsController.activeShipSize) {
			for (let i = 0; i < cells.length; i++) {
				if (!this.shipsController.isRotated) {
					if (this.boardMatrix[y][x + i] === this.boardMatrixBlockedCell) return
					this.boardMatrix[y][x + i] = value
				} else {
					if (
						this.boardMatrix[y + i][x] === this.boardMatrixBlockedCell) return
					this.boardMatrix[y + i][x] = value
				}
			}
		}
	}

	clearCells(activeShip: string, x: number, y: number) {
		if (!x && !y) return
		this.fillCells('empty', x, y)
	}

	get boardMatrix() {
		return this._boardMatrix
	}

	matrixLength() {
		return this._boardMatrix.length
	}

	get boardWidth() {
		return this.cellsInRow * this.cellSize
	}

	get cellSize() {
		return this._cellSize
	}
	valueToCell(y:number,x:number,val:string){
		this.boardMatrix[y][x]=val==='blocked'?this.boardMatrixBlockedCell:val==='ship'?88:99
	}
}