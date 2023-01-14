import Control from "../../../common/controll";
import BoardMatrix from "./canvasComponents/BoardMatrix";
import ShipsController from "./canvasComponents/ShipsController";
import RandomShips from "./canvasComponents/RandomShips";
import {ShipsSizes} from "./ChooseComponent";
import {imagesObjType} from "../application/app";

export const log = function (arg: any) {
	console.log(JSON.parse(JSON.stringify(arg)))
}
export type tShipCanvas = { type: string, isRotate: boolean, xC: number, yC: number }

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private prevPosX: number;
	private prevPosY: number;
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
	private onAddShip: (ship: tShipCanvas) => void;
	private boardMatrix: BoardMatrix;
	private shipsController: ShipsController;
	private ships: Record<string, number>;
	private randomShips: RandomShips;
	private shipsOnCanvas: tShipCanvas[];
	private isRotated: any;
	private activeShip: string;
	private imagesObj: imagesObjType;

	constructor(parentNode: HTMLElement, ships: Record<string, number>, isRotated: boolean, activeShip: string,
							shipsOnCanvas: tShipCanvas[], imagesObj: imagesObjType, isAutoPut: boolean, onAddShip: (ship: tShipCanvas) => void,
							onDataFromRandom: (type: string, isRotated: boolean) => void) {
		super(parentNode);
		this.imagesObj = imagesObj
		console.log('canvasSection',this.imagesObj)
		this.ships = ships
		this.isRotated = isRotated
		this.activeShip = activeShip
		this.shipsOnCanvas = shipsOnCanvas
		this.boardMatrix = new BoardMatrix(this.isRotated, ShipsSizes[this.activeShip as keyof typeof ShipsSizes])
		this.onAddShip = onAddShip
		this.parentNode = parentNode
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.canvasSection.node.width = this.canvasWidth = this.boardMatrix.boardWidth
		this.canvasSection.node.height = this.canvasHeight = this.boardMatrix.boardWidth

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
		console.log(shipsOnCanvas, 'SPSonCVS')
		this.boardMatrix.createEmptyMatrix()
		this.drawScene()
		this.randomShips = new RandomShips(this.boardMatrix.boardMatrix)
		this.randomShips.onGetCoordinates = (axis: string, type: string, y: number, x: number) => {
			//	this.shipsController.fromRandomData(type, axis !== 'vertical')
			//	this.prevPosX = x
			//	this.prevPosY = y
			onDataFromRandom(type, axis !== 'vertical')
			this.addShipToCanvasmage(x, y)
		}
		if (activeShip) {
			this.canvasSection.node?.addEventListener('mousemove', this.moveBinded)
			document.body.addEventListener('keyup', this.rotateShipBinded)
		}
	}

	autoPutShips() {
		//console.log(JSON.parse(JSON.stringify(this.boardMatrix.boardMatrix)),'MATRIX')
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
		//console.log('Click')
		const axis = this.isRotated ? 'horizont' : 'vertical'
		//	console.log(axis,'axisClick')
		this.addShipToCanvasmage(this.prevPosX, this.prevPosY)
	}

	addShipToCanvasmage(x: number, y: number) {
		const activeShipSize = ShipsSizes[this.activeShip as keyof typeof ShipsSizes]
		this.addToIntersection(x, y, activeShipSize, this.isRotated)
		this.boardMatrix.clearCells(this.activeShip, x, y);
		this.fillShipArea(x, y, activeShipSize)
		const imageObj: tShipCanvas = {xC: x, yC: y, isRotate: this.isRotated, type: this.activeShip}
		this.onAddShip(imageObj)
		this.drawScene()
	}

//
// apdatedShips() {
// 	//this.ships[this.activeShip] -= 1
//
// }

	isIntersection(x
									 :
									 number, y
									 :
									 number, lngth
									 :
									 number
	) {
		const sAr = []
		for (let i = 0; i < lngth; i++) {
			!this.isRotated
				? sAr.push(this.intersectionData.has(`${y}-${x + i}`))
				: sAr.push(this.intersectionData.has(`${y + i}-${x}`))
		}
		return sAr.some(e => e)
	}

	onMove(e:MouseEvent) {
		console.log('move',)
		const {x: xC, y: yC} = this.getCursorPosition(e, this.canvasSection.node)
		console.log(xC, yC)
		if (this.prevPosX && this.prevPosY && this.prevPosX === xC && this.prevPosY === yC) return
		if (this.boardMatrix.isOnBoard(xC, yC)) {
			this.boardMatrix.clearCells(this.activeShip, this.prevPosX, this.prevPosY)
			this.prevPosX = xC
			this.prevPosY = yC
			const isIntersect = this.isIntersection(this.prevPosX, this.prevPosY, ShipsSizes[this.activeShip as keyof typeof ShipsSizes])

			if (isIntersect) {
				this.isCurrentIntersect = true
				this.boardMatrix.fillCells('hovered', this.prevPosX, this.prevPosY)
			} else {
				this.isCurrentIntersect = false
				this.boardMatrix.fillCells('occupate', this.prevPosX, this.prevPosY)
				this.canvasSection.node.addEventListener('click', this.clickBinded)
			}
			this.drawScene()
		}
	}

	rotateShip(e:KeyboardEvent) {
		const keyName = e.code;
		if (keyName === 'Space') {
			// this.boardMatrix.clearCells(this.shipsController.activeShip, this.prevPosX, this.prevPosY)
			// this.shipsController.rotateShip()
			// this.boardMatrix.fillCells('occupate', this.prevPosX, this.prevPosY)
			this.drawScene()
		}
	}

//
// addActiveShip(activeShip: string) {
// 	this.shipsController.activeShip = activeShip
// 	document.body.addEventListener('keyup', this.rotateShipBinded)
// 	this.canvasSection.node?.addEventListener('mousemove', this.moveBinded)
// }

	getCurrentCell(x
									 :
									 number, y
									 :
									 number
	) {
		return {x: Math.floor(x / this.boardMatrix.cellSize), y: Math.floor(y / this.boardMatrix.cellSize)}
	}

	drawScene() {
		this.boardMatrix.boardMatrix.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle = cell === 5 ? "olive" : cell === 2 ? "red" : cell === 99
					? "green" : cell === 88 ? "blue" : 'darkGreen';
				this.ctx.strokeStyle = 'red';
				this.ctx.stroke()
				this.ctx.fillRect((this.boardMatrix.inPixels(cI)) + 1, (this.boardMatrix.inPixels(rI)) + 1, this.boardMatrix.cellSize - 2, this.boardMatrix.cellSize - 2);
			})
		})
		this.shipsOnCanvas.forEach(ship => {
			console.log(ship,'SHP')
			const axis=this.isRotated?'vertical':'horizont'
			const img = this.imagesObj[axis][this.activeShip]

			this.ctx.drawImage(img, this.boardMatrix.inPixels(ship.xC), this.boardMatrix.inPixels(ship.yC), img.width, img.height)
		})
	}

	public	getCursorPosition(event	:	MouseEvent, node:	HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		return this.getCurrentCell(x, y)
	}

	fillArea(y:number, x:number, val:string	) {
		this.boardMatrix.valueToCell(y, x, 'blocked')
		this.intersectionData.add(`${y}-${x}`)
		return `${y}-${x}`
	}

	circleStepsFill(y:number, x:number, val:string) {
		const pointsArr: string[] = []
		this.circleSteps.forEach(stp => {
			if (y + stp.y < 0 || y + stp.y >= this.boardMatrix.matrixLength()
				|| x + stp.x < 0 || x + stp.x >= this.boardMatrix.matrixLength()) return//y + stp.y, x + i + stp.x
			pointsArr.push(this.fillArea(y + stp.y, x + stp.x, val))
		})
		return pointsArr
	}

	private	fillShipArea(x:number, y:number, size:number
	) {
		const areaCells: Set<string> = new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = !this.isRotated ? x + i : x
			const yCoord = this.isRotated ? y + i : y

			this.circleStepsFill(yCoord, xCoord, 'blocked').forEach(c => {
				areaCells.add(c)
			})
			this.boardMatrix.valueToCell(yCoord, xCoord, 'ship')
		}
		this.randomShips.occupateCells(areaCells)
	}
}

export default CanvasSection
//todo create iage