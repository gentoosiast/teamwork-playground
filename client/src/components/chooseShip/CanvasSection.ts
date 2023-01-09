import Control from "../../../common/controll";
import {ShipsSizes} from "./ChooseComponent";
import BoardMatrix from "./canvasComponents/BoardMatrix";
import ShipsController from "./canvasComponents/ShipsController";
import RandomShips from "./canvasComponents/RandomShips";
import {EmptyAreas} from "./randomAlgorithm";

export type tShipCanvas = {
	xC: number, yC: number,
	rotate: boolean,
	image: HTMLImageElement,
	width: number, height: number,
	//xPx: number, yPx: number,
	//shipCells: { x: number, y: number }[],
	//shipType: string
}

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	//private prevPosX: number;
	//private prevPosY: number;
	private parentNode: HTMLElement;
	private canvasWidth: number;
	private canvasHeight: number;
	private mouseUpDebounce: boolean;
	private moveBinded: (e: MouseEvent) => void;
	private clickBinded: () => void;
	private intersectionData: Set<string>;
	private circleSteps: { x: number; y: number }[];
	private isCurrentIntersect: boolean = false;
	private rotateShipBinded: any;
	private onAddShip: (ship: string) => void;
	private boardMatrix: BoardMatrix;
	private shipsController: ShipsController;
	private ships: Record<string, number>;
	private randomShips: RandomShips;

	constructor(parentNode: HTMLElement, ships: Record<string, number>, onAddShip: (ship: string) => void) {
		super(parentNode);
		this.shipsController = new ShipsController()
		this.boardMatrix = new BoardMatrix(this.shipsController)
		this.ships = ships
		this.onAddShip = onAddShip
		this.parentNode = parentNode
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.canvasSection.node.width = this.canvasWidth = this.boardMatrix.boardWidth
		this.canvasSection.node.height = this.canvasHeight = this.boardMatrix.boardWidth
		//this.prevPosX
		//this.prevPosX
		this.mouseUpDebounce = false
		this.moveBinded = this.onMove.bind(this)
		this.clickBinded = this.onClick.bind(this)
		this.rotateShipBinded = this.rotateShip.bind(this)
		this.intersectionData = new Set()
		this.ctx = this.canvasSection.node.getContext('2d')
		this.circleSteps = [
			{x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1},
			{x: 1, y: 0}, {x: -1, y: 0},
			{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}
		]
		this.boardMatrix.createEmptyMatrix()
		this.drawScene()
		this.randomShips = new RandomShips(this.boardMatrix.boardMatrix)
		this.randomShips.onGetCoordinates = (axis: string, type: string, y: number, x:number) => {
			this.shipsController.fromRandomData(type, axis !== 'vertical')
		//	this.prevPosX = x
		//	this.prevPosY = y
			this.createShipImage(x,y,type,axis)
		}
	}

	autoPutShips() {
		this.randomShips.actualShips(this.ships)
		this.randomShips.putRandomShips()
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
	}

	onClick() {
		if (this.isCurrentIntersect) return
		this.canvasSection.node.removeEventListener('mousemove', this.moveBinded)
		this.canvasSection.node.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShipBinded)
		//this.createShipImage()
	}

	createShipImage(x:number,y:number,type:string,axis:string) {
		console.log(type,'SZZZZZ')
		const activeShipSize=ShipsSizes[type as keyof typeof ShipsSizes]
		const activeShip=type
		const isRotate=axis!=='vertical'
		this.addToIntersection(x, y, activeShipSize, isRotate)
		this.boardMatrix.clearCells(activeShip, x, y)
		this.fillShipArea(x, y, activeShipSize)
// 		this.createImage('./public/assets/ship.png',
// 			this.boardMatrix.cellSize * activeShipSize, this.boardMatrix.cellSize,
// 			(image) => {
// 			//console.log("PrevX",this.prevPosX,'-----prevY',this.prevPosY)
// 				const imageObj: tShipCanvas = {
// 					xC: x, yC: y, rotate: this.shipsController.isRotated, image,
// 					width: this.boardMatrix.cellSize * (!isRotate? activeShipSize : 1),
// 					height: this.boardMatrix.cellSize * (isRotate ? activeShipSize : 1),
// 				}
// //console.log("CRIMG")
// 				console.log(activeShipSize,'------SZZZZZ')
// 				this.shipsController.addShipOnCanvas(imageObj)
// 				this.onAddShip(activeShip)
// 				this.apdatedShips()
// 				this.drawScene()
// 			})
		this.drawScene()
	}

	apdatedShips() {
		this.ships[this.shipsController.activeShip] -= 1

	}

	isIntersection(x: number, y: number, lngth: number) {
		const sAr = []
		for (let i = 0; i < lngth; i++) {
			!this.shipsController.isRotated
				? sAr.push(this.intersectionData.has(`${y}-${x + i}`))
				: sAr.push(this.intersectionData.has(`${y + i}-${x}`))
		}
		return sAr.some(e => e)
	}

	onMove(e: MouseEvent) {
		const {x: xC, y: yC} = this.getCursorPosition(e, this.canvasSection.node)
		//if (this.prevPosX && this.prevPosY && this.prevPosX === xC && this.prevPosY === yC) return
		// if (this.boardMatrix.isOnBoard(xC, yC)) {
		// 	this.boardMatrix.clearCells(this.shipsController.activeShip, this.prevPosX, this.prevPosY)
		// 	this.prevPosX = xC
		// 	this.prevPosY = yC
		// 	const isIntersect = this.isIntersection(this.prevPosX, this.prevPosY, ShipsSizes[this.shipsController.activeShip as keyof typeof ShipsSizes])
		//
		// 	if (isIntersect) {
		// 		this.isCurrentIntersect = true
		// 		this.boardMatrix.fillCells('hovered', this.prevPosX, this.prevPosY)
		// 	} else {
		// 		this.isCurrentIntersect = false
		// 		this.boardMatrix.fillCells('occupate', this.prevPosX, this.prevPosY)
		// 		this.canvasSection.node.addEventListener('click', this.clickBinded)
		// 	}
		// 	this.drawScene()
		//
		// }
	}

	rotateShip(e: KeyboardEvent) {
		const keyName = e.code;
		if (keyName === 'Space') {
			// this.boardMatrix.clearCells(this.shipsController.activeShip, this.prevPosX, this.prevPosY)
			// this.shipsController.rotateShip()
			// this.boardMatrix.fillCells('occupate', this.prevPosX, this.prevPosY)
			this.drawScene()
		}
	}

	addActiveShip(activeShip: string) {
		this.shipsController.activeShip = activeShip
		document.body.addEventListener('keyup', this.rotateShipBinded)
		this.canvasSection.node?.addEventListener('mousemove', this.moveBinded)
	}

	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this.boardMatrix.cellSize), y: Math.floor(y / this.boardMatrix.cellSize)}
	}

	drawScene() {
		this.boardMatrix.boardMatrix.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle = cell === 5 ? "olive" : cell === 2 ? "red" : cell === 99
					? "green" :cell === 88?"blue": 'darkGreen';
				this.ctx.strokeStyle = 'red';
				this.ctx.stroke()
				this.ctx.fillRect((this.boardMatrix.inPixels(cI)) + 1, (this.boardMatrix.inPixels(rI)) + 1, this.boardMatrix.cellSize - 2, this.boardMatrix.cellSize - 2);
			})
		})
		this.shipsController.shipsOnCanvas.forEach(ship => {
			this.ctx.drawImage(ship.image, this.boardMatrix.inPixels(ship.xC), this.boardMatrix.inPixels(ship.yC), ship.width, ship.height)
		})
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

	fillArea(y: number, x: number, val: string) {
		this.boardMatrix.valueToCell(y, x, 'blocked')
		this.intersectionData.add(`${y}-${x}`)
		return `${y}-${x}`
	}

	circleStepsFill(y: number, x: number, val: string) {
		const pointsArr:string[]=[]
		this.circleSteps.forEach(stp => {
			if (y + stp.y < 0 || y + stp.y >= this.boardMatrix.matrixLength()
				|| x + stp.x < 0 || x + stp.x >= this.boardMatrix.matrixLength()) return//y + stp.y, x + i + stp.x
			pointsArr.push(this.fillArea(y + stp.y, x + stp.x, val))
		})
		return pointsArr
	}

	private fillShipArea(x: number, y: number, size: number) {
		const areaCells:Set<string>=new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = !this.shipsController.isRotated ? x + i : x
			const yCoord = this.shipsController.isRotated ? y + i : y

			this.circleStepsFill(yCoord, xCoord, 'blocked').forEach(c=>{
				areaCells.add(c)
			})
				this.boardMatrix.valueToCell(yCoord, xCoord, 'ship')
		}
		this.randomShips.occupateCells(areaCells)
	}
}

export default CanvasSection
//todo create iage