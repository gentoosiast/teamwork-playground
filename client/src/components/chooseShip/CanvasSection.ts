import Control from "../../../common/controll";
import {ShipsSizes} from "./ChooseComponent";

type tShipCanvas = {
	xC: number, yC: number,
	rotate: false, image: HTMLImageElement,
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
	private moveBinded: (e:MouseEvent) => void;
	private clickBinded: ()=>void;

	constructor(parentNode: HTMLElement, ships: Record<string, number>, activeShip?: string) {
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
		this.moveBinded=this.onMove.bind(this)
		this.clickBinded=this.onClick.bind(this)
		this.shipsOnCanvas = []
		this.boardMatrix = []
		this.ctx = this.canvasSection.node.getContext('2d')

		this.createEmptyMatrix()

		this.drawScene()
	}

	clearCells(activeShip: string) {
		if (!this.prevPosX && !this.prevPosY) return
		this.fillCells(activeShip, 99)
	}

	fillCells(activeShip: string, value: number) {
		const cells=[]
		for (let i = 0; i < ShipsSizes[activeShip as keyof typeof ShipsSizes]; i++) {
			if(this.boardMatrix[this.prevPosX + i][this.prevPosY])cells.push("+")
		}
		if(cells.length===ShipsSizes[activeShip as keyof typeof ShipsSizes]){
			for(let i=0;i<cells.length;i++){
				this.boardMatrix[this.prevPosX + i][this.prevPosY]=value
			}
		}
	}

	onClick(){
		this.canvasSection.node.removeEventListener('mousemove',this.moveBinded)
		this.canvasSection.node.removeEventListener('click',this.clickBinded)
		this.createImage('./public/assets/ship.png',
			this.cellSize * ShipsSizes[this.activeShip as keyof typeof ShipsSizes], this.cellSize,
			(image) => {
				const imageObj: tShipCanvas = {
					xC:this.prevPosX, yC:this.prevPosY, rotate: false, image,
					width: this.cellSize * ShipsSizes[this.activeShip as keyof typeof ShipsSizes],
					height: this.cellSize,
					//shipCells,
					//xPx: this.inPixels(xC),
					//	yPx: this.inPixels(yC),
					//	shipType: eventData
				}
				this.shipsOnCanvas.push(imageObj)
				this.drawScene()
			})

	}
	onMove(e: MouseEvent) {
		const {x: xC, y: yC} = this.getCursorPosition(e, this.canvasSection.node)
		if (this.prevPosX && this.prevPosY && this.prevPosX === xC && this.prevPosY === yC) return
		this.clearCells(this.activeShip)
		this.prevPosX = xC
		this.prevPosY = yC
		this.fillCells(this.activeShip, 1)
		this.drawScene()
		this.canvasSection.node.addEventListener('click', this.clickBinded)
	}

	addActiveShip(activeShip: string) {
		this.activeShip = activeShip
		this.canvasSection.node?.addEventListener('mousemove',this.moveBinded)
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
				this.ctx.fillStyle = cell === 99 ? "green" : 'red';
				this.ctx.strokeStyle = 'red';
				this.ctx.stroke()
				this.ctx.fillRect((rI * this.cellSize) + 1, (cI * this.cellSize) + 1, this.cellSize - 2, this.cellSize - 2);

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
}

export default CanvasSection