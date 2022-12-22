import Control from "../../../common/controll";
import {ShipsSizes} from "./ChooseComponent";

type tShipCanvas = {
	xC: number, yC: number,
	rotate: false, image: HTMLImageElement,
	width: number, height: number,
	xPx: number, yPx: number,
	shipCells: { x: number, y: number }[],
	shipType: string
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

	constructor(parentNode: HTMLElement, ships: Record<string, number>) {
		super(parentNode);
		this.parentNode = parentNode
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.cellSize = 30
		this.cellsInRow = 10
		this.canvasSection.node.width = this.canvasWidth = this.cellSize * this.cellsInRow
		this.canvasSection.node.height = this.canvasHeight = this.cellSize * this.cellsInRow
		this.prevPosX
		this.prevPosX
		this.mouseUpDebounce = false
		this.mouseDownHandlerBinded = this.mouseDownHandler.bind(this)
		this.moveHandlerBinded = this.moveHandler.bind(this)
		this.shipsOnCanvas = []
		this.boardMatrix = []
		this.ctx = this.canvasSection.node.getContext('2d')
		this.canvasSection.node.addEventListener('mousedown', this.mouseDownHandlerBinded)
		this.canvasSection.node.ondragover = (e) => {
			e.preventDefault()
		}
		this.canvasSection.node.ondrop = (e) => {
			const {x: xC, y: yC} = this.getCursorPosition(e, this.canvasSection.node)
			//console.log(x,y,'CPOS')
			const eventData = e.dataTransfer.getData('el')
			const shipWidth = this.inPixels(ShipsSizes[eventData as keyof typeof ShipsSizes])
			const shipHeight = this.inPixels(1)
			const shipCells: { x: number, y: number }[] = []

			for (let i = 0; i < ShipsSizes[eventData as keyof typeof ShipsSizes]; i++) {
				shipCells.push({x: xC, y: yC + i})
				this.boardMatrix[yC][xC] = 1
				//todo add closest cells
			}
			this.createImage('./public/assets/ship.png', shipWidth, shipHeight, (image) => {
				const imageObj: tShipCanvas = {
					xC, yC, rotate: false, image,
					width: shipWidth, height: shipHeight,
					shipCells,
					xPx: this.inPixels(xC),
					yPx: this.inPixels(yC),
					shipType: eventData
				}
				this.shipsOnCanvas.push(imageObj)
				//todo boardMatrix fillcells
				this.drawShip(image, this.inPixels(xC), this.inPixels(yC), imageObj.width, imageObj.height)
			})
		}
		this.createEmptyMatrix()
		this.drawScene()
	}

	inPixels(indx: number) {
		return indx * this.cellSize
	}

	createEmptyMatrix() {
		for (let i = 0; i < this.cellsInRow; i++) {
			const row = []
			for (let j = 0; j < this.cellsInRow; j++) {
				row.push(0)
			}
			this.boardMatrix.push(row)
		}
	}

	drawShip(image: HTMLImageElement, x: number, y: number, width: number, height: number) {
		this.ctx.drawImage(image, x, y, width, height)
	}

	mouseDownHandler(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		this.prevPosX = x
		this.prevPosY = y
		console.log(this.prevPosY, this.prevPosX)
		this.canvasSection.node.addEventListener('mousemove', this.moveHandlerBinded)
	}

	isChangeCell(x: number, y: number) {
		console.log(this.prevPosX !== x || this.prevPosY !== y)
		return this.prevPosX !== x || this.prevPosY !== y
	}

	stopMoveShip(ship: tShipCanvas, x: number, y: number) {
		console.log("------")
		this.prevPosX = x
		this.prevPosY = y

		this.canvasSection.node.removeEventListener('mousemove', this.moveHandlerBinded)
		this.canvasSection.node.removeEventListener('mouseup',this.stopMoveShip(ship,x,y))
		ship.shipCells = []
		for (let i = 0; i <= ShipsSizes[ship.shipType as keyof typeof ShipsSizes]; i++) {
			ship.shipCells.push({x, y: y + i})
		}
	}

	moveHandler(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		if (this.isChangeCell(x, y)) {
			const currentShip = this.getCurrentShip(this.prevPosX, this.prevPosY)
			currentShip.xPx = this.inPixels(x)
			currentShip.yPx = this.inPixels(y)
			this.canvasSection.node.addEventListener('mouseup', () => this.stopMoveShip(currentShip, x, y))
			//this.canvasSection.node.addEventListener('mouseleave', ()=>this.stopMoveShip(currentShip,x,y))
			// 	console.log('change')
			// 	currentShip.shipCells=[]
			//todo redraw in matrix
			///if position from corner dons allow
		}
		//console.log(currentShip.yPx,currentShip.xPx,'^^^^^')
		this.drawScene()
	}

	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this.cellSize), y: Math.floor(y / this.cellSize)}
	}

	drawScene() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.ctx.fillStyle = 'orange'
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.shipsOnCanvas.forEach(ship => {
			this.ctx.drawImage(ship.image, ship.xPx, ship.yPx, ship.width, ship.height)
		})
		this.drawMesh()
	}

	drawLine(x1: number, y1: number, x2: number, y2: number) {
		this.ctx.beginPath()
		this.ctx.moveTo(x1, y1)
		this.ctx.strokeStyle = 'darkred'
		this.ctx.lineTo(x2, y2)
		this.ctx.stroke()
	}

	drawMesh() {
		for (let i = 0; i < this.canvasWidth; i += this.cellSize) {
			this.drawLine(i, 0, i, this.canvasHeight)
		}
		for (let i = 0; i < this.canvasHeight; i += this.cellSize) {
			this.drawLine(0, i, this.canvasWidth, i)
		}
	}

	getCurrentShip(x: number, y: number) {
		return this.shipsOnCanvas.find(el => el.shipCells.find(cell => {
			return cell.x === x && cell.y === y
		}))
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
}

export default CanvasSection