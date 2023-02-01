import {log} from "../CanvasSection";
import SpriteImage from "../../gameField/SpriteImage";

export class BoardMatrixElementary {
	public cellsInRow: number;
	public _cellSize: number;
	public board: number[][];

	constructor(board: number[][]) {
		this.board = JSON.parse(JSON.stringify(board))
		this.cellsInRow = 10
		this._cellSize = 30
	}

	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this._cellSize), y: Math.floor(y / this._cellSize)}
	}

	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		return this.getCurrentCell(x, y)
	}
}

export class SpriteBoardMatrix extends BoardMatrixElementary {
	private ctx: CanvasRenderingContext2D;
	private occupied: { x: number; y: number }[];
	private img: SpriteImage;

	constructor(board: number[][], ctx: CanvasRenderingContext2D) {
		super(board);
		this.ctx = ctx
		this.drawBoard()
	}

	drawBoard() {
		this.board.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle = `rgba(255, 20, 20, 0.2)`
				this.ctx.fillRect((this.inPixels(cI)) + 1, (this.inPixels(rI)) + 1,
					this._cellSize - 2, this._cellSize - 2);
			})
		})
	}

	inPixels(indx: number) {
		return indx * this._cellSize
	}
get cellSize(){
		return this._cellSize
}
	drawExp( coords:string,shipImage:SpriteImage) {
		const [bY,bX]=coords.split('-')
		// this.ctx.drawImage(shipImage.imgObj,
		// 	shipImage.curFrame,0,
		// 	shipImage.imgObj.width/6,shipImage.imgObj.height,
		// 	this.inPixels(+bX),this.inPixels(+bY),
		// 	this._cellSize,this._cellSize)//this.img.imgObj().width,this.img.imgObj().height);//frame size
		// shipImage.incCurFrame()

		//(this,this.img.curFrame,bX,bY))
	}

	upDateOccupid(occupied: { x: number, y: number }[]) {

	}
}

export class BoardMatrixBase extends BoardMatrixElementary {
	onFillCells: (fillData: { data: string[], value: number }) => void
	onClearHovered: (value: number) => void

//todo cellSize from reducer
	constructor(board: number[][]) {
		super(board)

	}

	isOnBoard(x: number, y: number, activeSize: number, rotated: boolean) {
		const v = !rotated
			? ((x + activeSize) <= this.matrixLength() && y < this.matrixLength() && y >= 0 && x >= 0)
			: ((y + activeSize) <= this.matrixLength()
				&& x < this.matrixLength() && y >= 0 && x >= 0)
		return v
	}

	matrixLength() {
		return this.board.length
	}

	get cellSize() {
		return this._cellSize
	}
}

export class BoardMatrixGameField extends BoardMatrixBase {
	private ckickBinded: any;
	onGetClickedCell: (x: number, y: number) => void

	constructor(board: number[][]) {
		super(board);
		this.ckickBinded = this.onClick.bind(this)
	}

	onClick(cell: { x: number, y: number }) {
		//	const {x,y}=this.getCursorPosition(e,HtmlEl)
		this.onGetClickedCell(cell.x, cell.y)
	}

	occupiedCells(occupied: { x: number, y: number }[]) {

	}
}

export default class BoardMatrixChooseShips extends BoardMatrixBase {

	private boardMatrixEmptyValue: number;
	private boardMatrixFullValue: number;
	private boardMatrixBlockedCell: number;
	private boardMatrixHoverValue: number;
	onFillCells: (fillData: { data: string[], value: number }) => void
	onClearHovered: (value: number) => void
	private hoveredCells: string[];
	private boardOccupateValue: number;

//todo cellSize from reducer

	constructor(board: number[][]) {
		super(board)
		//	this.board = JSON.parse(JSON.stringify(board))
		this.cellsInRow = 10
		this._cellSize = 30
		this.hoveredCells = []
		this.boardMatrixFullValue = 1
		this.boardMatrixBlockedCell = 5
		this.boardMatrixHoverValue = 2
		this.boardMatrixEmptyValue = 0
		this.boardOccupateValue = 7
	}

	fillCell(val: string, x: number, y: number, activeSize: number, isRotated: boolean) {
		this.clearCells()
		this.fillCells(val, x, y, activeSize, isRotated)
	}

	getBlockValue() {
		return this.boardMatrixBlockedCell
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

	valueToCell(y: number, x: number, val: string) {
		const t = val === 'blocked'
			? this.boardMatrixBlockedCell
			: val === 'ship'
				? 88 : 99
		this.board[y][x] = t
	}

	updateBoard(board: number[][]) {
		this.board = JSON.parse(JSON.stringify(board))
	}
}