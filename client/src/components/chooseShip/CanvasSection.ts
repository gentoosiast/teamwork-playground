import Control from "../../../common/controll";
import {ShipsSizes} from "./ChooseComponent";

type tShipCanvas = {
	xC: number, yC: number,
	rotate: false,
	image: HTMLImageElement,
	width: number, height: number,
	//xPx: number, yPx: number,
	//shipCells: { x: number, y: number }[],
	//shipType: string
}

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private prevPosX: number;
	private prevPosY: number;
	private mouseDownHandlerBinded: () => void;
	private moveHandlerBinded: () => void;
	private parentNode: HTMLElement;
	private canvasWidth: number;
	private canvasHeight: number;
	public garlandCoordinates: { y: number; x: number[] }[];
	onDroppedShip: (toyIndex: string) => void
	private shipsOnCanvas: tShipCanvas[];
	private cellSize: number;
	private boardMatrix: number[][];
	private cellsInRow: number;
	private mouseUpDebounce: boolean;
	private activeShip: string;
	private moveBinded: (e: MouseEvent) => void;
	private clickBinded: () => void;
	private intersectionData: Set<string>;
	private isReversed: boolean;
	private boardMatrixEmptyValue: number;
	private boardMatrixFullValue: number;
	private circleSteps: { x: number; y: number }[];
	private boardMatrixBlockedCell: number;
	private isCurrentIntersect: boolean = false;

	constructor(parentNode: HTMLElement, ships: Record<string, number>, activeShip?: string) {
		super(parentNode);
		this.parentNode = parentNode
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.cellSize = 30
		this.cellsInRow = 10
		this.isReversed = false
		this.canvasSection.node.width = this.canvasWidth = this.cellSize * this.cellsInRow
		this.canvasSection.node.height = this.canvasHeight = this.cellSize * this.cellsInRow
		this.prevPosX
		this.prevPosX
		this.mouseUpDebounce = false
		this.moveBinded = this.onMove.bind(this)
		this.clickBinded = this.onClick.bind(this)
		this.shipsOnCanvas = []
		this.boardMatrix = []
		this.boardMatrixEmptyValue = 99
		this.boardMatrixFullValue = 1
		this.boardMatrixBlockedCell = 5
		this.intersectionData = new Set()
		this.ctx = this.canvasSection.node.getContext('2d')
		this.circleSteps = [
			{x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1},
			{x: 1, y: 0}, {x: -1, y: 0},
			{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}
		]
		this.createEmptyMatrix()
		this.drawScene()
	}

	clearCells(activeShip: string) {
		if (!this.prevPosX && !this.prevPosY) return
		this.fillCells(activeShip, this.boardMatrixEmptyValue)
	}

	fillCells(activeShip: string, value: number) {
		const cells = []
		for (let i = 0; i < ShipsSizes[activeShip as keyof typeof ShipsSizes]; i++) {
			if (this.boardMatrix[this.prevPosY][this.prevPosX + i]) cells.push("+")
		}
		if (cells.length === ShipsSizes[activeShip as keyof typeof ShipsSizes]) {
			for (let i = 0; i < cells.length; i++) {
				if (this.boardMatrix[this.prevPosY][this.prevPosX + i] === this.boardMatrixBlockedCell) return
				this.boardMatrix[this.prevPosY][this.prevPosX + i] = value
			}
		}
	}

	addToIntersection(x: number, y: number, lngth: number, rotate: boolean) {
		if (!rotate) {
			for (let i = 0; i < lngth; i++) {
				this.intersectionData.add(`${y}-${x + i}`)
			}
		} else {
			for (let i = y; i < lngth; i++) {
				this.intersectionData.add(`${y + i}-${x}`)
			}
		}
		console.log(this.intersectionData, 'INT')
	}

	onClick() {
		if (this.isCurrentIntersect) return
		this.canvasSection.node.removeEventListener('mousemove', this.moveBinded)
		this.canvasSection.node.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShip)
		this.createImage('./public/assets/ship.png',
			this.cellSize * ShipsSizes[this.activeShip as keyof typeof ShipsSizes], this.cellSize,
			(image) => {
				const imageObj: tShipCanvas = {
					xC: this.prevPosX, yC: this.prevPosY, rotate: false, image,
					width: this.cellSize * ShipsSizes[this.activeShip as keyof typeof ShipsSizes],
					height: this.cellSize,
					//shipCells,
					//xPx: this.inPixels(xC),
					//	yPx: this.inPixels(yC),
					//	shipType: eventData
				}
				this.shipsOnCanvas.push(imageObj)
				this.addToIntersection(this.prevPosX, this.prevPosY, ShipsSizes[this.activeShip as keyof typeof ShipsSizes], false)
				this.clearCells(this.activeShip)
				this.fillShipArea(this.prevPosX, this.prevPosY, ShipsSizes[this.activeShip as keyof typeof ShipsSizes])
				this.drawScene()
			})

	}

	isIntersection(x: number, y: number, lngth: number) {
		const sAr = []
		for (let i = 0; i < lngth; i++) {
			!this.isReversed
				? sAr.push(this.intersectionData.has(`${this.prevPosY}-${this.prevPosX + i}`))
				: sAr.push(this.intersectionData.has(`${this.prevPosY + i}-${this.prevPosX}`))
		}
		//console.log(sAr)
		return sAr.some(e => e)
		//	return this.intersectionData.has(`${this.prevPosY}-${this.prevPosX}`)
	}

	isOnBoard(x: number, y: number) {
		return (x + ShipsSizes[this.activeShip as keyof typeof ShipsSizes]) <= this.boardMatrix.length
			&& y < this.boardMatrix.length && y >= 0 && x >= 0
	}

	onMove(e: MouseEvent) {
		const {x: xC, y: yC} = this.getCursorPosition(e, this.canvasSection.node)
		if (this.prevPosX && this.prevPosY && this.prevPosX === xC && this.prevPosY === yC) return
		if (this.isOnBoard(xC, yC)) {
			this.clearCells(this.activeShip)
			this.prevPosX = xC
			this.prevPosY = yC
			const isIntersect = this.isIntersection(this.prevPosX, this.prevPosY, ShipsSizes[this.activeShip as keyof typeof ShipsSizes])

			if (isIntersect) {
				this.isCurrentIntersect = true
				this.fillCells(this.activeShip, 2)
			} else {
				this.isCurrentIntersect = false
				this.fillCells(this.activeShip, 1)
				this.canvasSection.node.addEventListener('click', this.clickBinded)
			}
			this.drawScene()

		}
	}

	rotateShip(e: KeyboardEvent) {
		const keyName = e.key;
		console.log(e.key, e.code, e.keyCode)
		if (keyName === 'Space') {
			this.isReversed = !this.isReversed
		}
	}

	addActiveShip(activeShip: string) {
		this.activeShip = activeShip
		document.body.addEventListener('keyup', this.rotateShip)
		this.canvasSection.node?.addEventListener('mousemove', this.moveBinded)
	}

	inPixels(indx: number) {
		return indx * this.cellSize
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

	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this.cellSize), y: Math.floor(y / this.cellSize)}
	}

	drawScene() {
		this.boardMatrix.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle = cell === 5 ? "olive" : cell === 2 ? "red" : cell === 99 ? "green" : 'darkGreen';
				this.ctx.strokeStyle = 'red';
				this.ctx.stroke()
				this.ctx.fillRect((cI * this.cellSize) + 1, (rI * this.cellSize) + 1, this.cellSize - 2, this.cellSize - 2);
			})
		})
		//this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		//this.ctx.fillStyle = 'orange'
		//	this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.shipsOnCanvas.forEach(ship => {
			//	console.log("SHIP", ship)
			this.ctx.drawImage(ship.image, this.inPixels(ship.xC), this.inPixels(ship.yC), ship.width, ship.height)
		})
		//this.drawMesh()
	}

	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		return this.getCurrentCell(x, y)
	}

	createImage(url: string, width: number, height: number, callback: (img: HTMLImageElement) => void) {
		const image = new Image()
		image.src = url
		image.width = width
		image.height = height
		image.onload = () => {
			callback(image)
		}
	}

	private fillShipArea(x: number, y: number, size: number) {
		for (let i = 0; i < size; i++) {
			if (!this.isReversed) {
				this.boardMatrix[y][x + i] = this.boardMatrixBlockedCell
				this.circleSteps.forEach(stp => {
					if (!this.boardMatrix[y + stp.y][x + i + stp.x]) return
					this.boardMatrix[y + stp.y][x + i + stp.x] = this.boardMatrixBlockedCell
					this.intersectionData.add(`${y + stp.y}-${x + i + stp.x}`)
				})
			} else {
				this.boardMatrix[y + i][x] = this.boardMatrixBlockedCell
				this.circleSteps.forEach(stp => {
					if (!this.boardMatrix[y + i + stp.y][x + stp.x])
						(this.boardMatrix[y + i + stp.y][x + stp.x] = this.boardMatrixBlockedCell)
					this.intersectionData.add(`${y + i + stp.y}-${x + stp.x}`)
				})
			}
		}
	}
}

export default CanvasSection