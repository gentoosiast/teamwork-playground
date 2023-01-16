import Control from "../../../common/controll";
import BoardMatrix from "./canvasComponents/BoardMatrix";
import ShipsController from "./canvasComponents/ShipsController";
import RandomShips from "./canvasComponents/RandomShips";
import {ShipsSizes} from "./ChooseComponent";
import {imagesObjType} from "../application/app";
import IntersectionController from "./canvasComponents/IntersectionController";

export const log = function (arg: any) {
	console.log(JSON.parse(JSON.stringify(arg)))
}
export type tShipCanvas = { type: string, isRotate: boolean, xC: number, yC: number }

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private parentNode: HTMLElement;
	private canvasWidth: number;
	private canvasHeight: number;
	private mouseUpDebounce: boolean;
	private moveBinded: (e: MouseEvent) => void;
	private clickBinded: () => void;
	private circleSteps: { x: number; y: number }[];
	private rotateShipBinded: any;
	private boardMatrix: BoardMatrix;
	private ships: Record<string, number>;
	private randomShips: RandomShips;
	private shipsOnCanvas: tShipCanvas[];
	private isRotated: any;
	private activeShip: string;
	private imagesObj: imagesObjType;
	private board: number[][];
	private intersectionController: IntersectionController;
	private activeSize: number;
	private x: number;
	private y: number
	private isMovesLisen: boolean;
	private isListenCkick: boolean;

	private onAddShip: (ship: tShipCanvas) => void;
	onRotateShip: () => void
	onFillCells: (fillData: { data: string[], value: number }) => void
	onClearHovered: (value: number) => void
	onResetActiveShip:()=>void
	onFillShipArea:(areaCells:Set<string>,value:number)=>void
	constructor(parentNode: HTMLElement, ships: Record<string, number>, board: number[][],
							isRotated: boolean, activeShip: string,
							shipsOnCanvas: tShipCanvas[], imagesObj: imagesObjType, isAutoPut: boolean,
							onAddShip: (ship: tShipCanvas) => void,
							onDataFromRandom: (type: string, isRotated: boolean) => void) {
		super(parentNode);
		this.imagesObj = imagesObj
		this.ships = ships
		this.isRotated = false
		this.activeShip = activeShip
		this.activeSize = ShipsSizes[this.activeShip as keyof typeof ShipsSizes]
		this.board = board
		this.boardMatrix = new BoardMatrix(this.isRotated, this.board)
		this.boardMatrix.onClearHovered = (value: number) => 	this.onClearHovered(value)
		this.boardMatrix.onFillCells = (fillData: { data: string[], value: number }) => {
			console.log(fillData)
			this.onFillCells(fillData)
		}
		this.onAddShip = onAddShip
		this.parentNode = parentNode

		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.canvasSection.node.width = this.canvasWidth = this.boardMatrix.boardWidth
		this.canvasSection.node.height = this.canvasHeight = this.boardMatrix.boardWidth
		this.intersectionController = new IntersectionController()
		this.mouseUpDebounce = false
		this.isMovesLisen = false
		this.isListenCkick = false
		this.moveBinded = this.onMove.bind(this)
		this.clickBinded = this.onClick.bind(this)
		this.rotateShipBinded = this.rotateShip.bind(this)
		this.ctx = this.canvasSection.node.getContext('2d')
		this.circleSteps = [
			{x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1},
			{x: 1, y: 0}, {x: -1, y: 0},
			{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}
		]
		this.drawScene()
		this.randomShips = new RandomShips(this.board)
		this.randomShips.onGetCoordinates = (axis: string, type: string, y: number, x: number) => {
			//	this.shipsController.fromRandomData(type, axis !== 'vertical')
			//	this.prevPosX = x
			//	this.prevPosY = y
			onDataFromRandom(type, axis !== 'vertical')
			this.addShipToCanvasmage(x, y)
		}

		if (!this.isMovesLisen) {
			this.canvasSection.node.onmousemove = this.moveBinded
			this.isMovesLisen = true
		}
	}

	autoPutShips() {
		//console.log(JSON.parse(JSON.stringify(this.boardMatrix.boardMatrix)),'MATRIX')
		this.randomShips.actualShips(this.ships)
		this.randomShips.putRandomShips()
	}

	onClick(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		//	if (this.intersectionController.isCurrentIntersect) return
		this.canvasSection.node.removeEventListener('mousemove', this.moveBinded)
		this.canvasSection.node.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShipBinded)
		this.addShipToCanvasmage(x, y)
		this.isListenCkick = false
		this.isMovesLisen = false
		this.onResetActiveShip()
	}

	updateShipOnBoard(shipsOnCanvas: tShipCanvas[]) {
		this.shipsOnCanvas = shipsOnCanvas
		this.drawScene()
	}

	addShipToCanvasmage(x: number, y: number) {
		this.intersectionController.iterAddToIntersection(x, y, this.activeSize, this.isRotated)
		this.boardMatrix.clearCells();
		this.fillShipArea(x, y, this.activeSize)
		const imageObj: tShipCanvas = {xC: x, yC: y, isRotate: this.isRotated, type: this.activeShip}
		this.onAddShip(imageObj)
		this.drawScene()
	}

	addActiveShip(ship: string) {
		this.activeShip = ship
		this.activeSize = ShipsSizes[ship as keyof typeof ShipsSizes]
	}

	setRotate(rotate: boolean) {
		this.isRotated = rotate
	}

	onMove(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		if (this.boardMatrix.isOnBoard(x, y, this.activeSize, this.isRotated)) {
			this.boardMatrix.clearCells()
			this.x = x
			this.y = y
			const isIntersect = this.intersectionController.isIntersection(
				x, y, this.activeSize, this.isRotated)
			if (!isIntersect && !this.isListenCkick) {
				console.log("MOVE add listens")
				//	this.boardMatrix.fillCells('hovered', x, y, this.activeSize, this.isRotated)
				//	document.body.addEventListener('click', () => console.log("BODY"))
				document.body.addEventListener('keyup', this.rotateShipBinded)
				this.canvasSection.node.addEventListener('click', this.clickBinded)
				//todo here if intersect other color fill hovered cells and not to add listener
				this.isListenCkick = true
			}
			if (isIntersect) {
				console.log("ADD logic color to intersect")
			}
			//	this.isCurrentIntersect = true
			this.boardMatrix.fillCells('hovered', x, y, this.activeSize, this.isRotated)
			// 	if (isIntersect) {
			// 		//	this.isCurrentIntersect = true
			// 		//	this.boardMatrix.fillCells('hovered', x,y)
			// 	} else {
			// 		//	this.isCurrentIntersect = false
			// 		//		this.boardMatrix.fillCells('occupate', x,y)
			// 		//	this.canvasSection.node.addEventListener('click', this.clickBinded)
			// 	}
			this.drawScene()
		}
	}

	updateBoard(board: number[][]) {
		log(board)
		this.board = board
		this.boardMatrix.updateBoard(board)
		this.drawScene()
		//console.log(this.board)
	}

	rotateShip(e: KeyboardEvent) {
		console.log("ROTAATE")
		const keyName = e.code;
		if (keyName === 'Space') {
			this.boardMatrix.clearCells()
			this.onRotateShip()
			this.boardMatrix.fillCells('hovered', this.x, this.y, this.activeSize, this.isRotated)
			this.drawScene()
		}
	}

	getCurrentCell(x: number, y: number) {
		return {x: Math.floor(x / this.boardMatrix.cellSize), y: Math.floor(y / this.boardMatrix.cellSize)}
	}

///filledShipsArea
	///ships
	//if activeShip, drawdarkGreen
	drawScene() {
		log(this.board)
		this.board.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				console.log(cell)
				this.ctx.fillStyle =
					cell === 5 ? "olive" :
						cell === 2 ? 'darkGreen' :
							cell === 7 ? "red"
								: "green"
			//	this.ctx.strokeStyle = 'red';
			//	this.ctx.stroke()
				this.ctx.fillRect((this.boardMatrix.inPixels(cI)) + 1, (this.boardMatrix.inPixels(rI)) + 1,
					this.boardMatrix.cellSize - 2, this.boardMatrix.cellSize - 2);
			})
		})
		this.shipsOnCanvas?.forEach(ship => {
			const axis = ship.isRotate ? 'vertical' : 'horizont'
			const img = this.imagesObj[axis][ship.type]
			this.ctx.drawImage(img, this.boardMatrix.inPixels(ship.xC), this.boardMatrix.inPixels(ship.yC), img.width, img.height)
		})
	}

	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		return this.getCurrentCell(x, y)
	}

	fillArea(y: number, x: number, val: string) {
		this.boardMatrix.valueToCell(y, x, 'blocked')
		this.intersectionController.addToIntersection(`${y}-${x}`)
		return `${y}-${x}`
	}

	circleStepsFill(y: number, x: number, val: string) {
		const pointsArr: string[] = []
		this.circleSteps.forEach(stp => {
			if (y + stp.y < 0 || y + stp.y >= this.boardMatrix.matrixLength()
				|| x + stp.x < 0 || x + stp.x >= this.boardMatrix.matrixLength()) return//y + stp.y, x + i + stp.x
			pointsArr.push(this.fillArea(y + stp.y, x + stp.x, val))
		})
		return pointsArr
	}

	private fillShipArea(x: number, y: number, size: number
	) {
	//	console.log("FILLAREA")
		const areaCells: Set<string> = new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = !this.isRotated ? x + i : x
			const yCoord = this.isRotated ? y + i : y

			this.circleStepsFill(yCoord, xCoord, 'blocked').forEach(c => {
				areaCells.add(c)
			})
			this.boardMatrix.valueToCell(yCoord, xCoord, 'ship')
		}
	//	console.log(areaCells,'AREACELLS')
		this.randomShips.occupateCells(areaCells)
	this.onFillShipArea(areaCells,this.boardMatrix.getBlockValue())
	}
}

export default CanvasSection
//todo create iage