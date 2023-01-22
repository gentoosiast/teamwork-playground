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
//todo field onCanvas
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
	onResetActiveShip: () => void
	onFillShipArea: (areaCells: Set<string>, value: number) => void
	private createEmptyValues: boolean;
	private isRandomMode: boolean;
	//shipsReady:()=>void
	constructor(parentNode: HTMLElement, ships: Record<string, number>, board: number[][],
							isRotated: boolean, activeShip: string,
							shipsOnCanvas: tShipCanvas[], imagesObj: imagesObjType, isAutoPut: boolean,
							onAddShip: (ship: tShipCanvas) => void,
							// onDataFromRandom: (type: string, isRotated: boolean) => void
	) {
		super(parentNode);
		this.imagesObj = imagesObj
		this.isRandomMode=false
		this.ships = ships
		this.isRotated = false
		this.activeShip = activeShip
		this.activeSize = ShipsSizes[this.activeShip as keyof typeof ShipsSizes]
		this.board = board
		this.boardMatrix = new BoardMatrix(this.isRotated, this.board)
		this.boardMatrix.onClearHovered = (value: number) => this.onClearHovered(value)
		this.boardMatrix.onFillCells = (fillData: { data: string[], value: number }) => {
			this.onFillCells(fillData)
		}
		this.onAddShip = onAddShip
		this.parentNode = parentNode
this.createEmptyValues=false
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
		this.randomShips = new RandomShips()
		this.randomShips.onGetCoordinates = (type: string,
																				 y: number, x: number, isRotate: boolean) => {

			const size=ShipsSizes[type as keyof typeof ShipsSizes]
			 this.addShipToCanvasmage(x, y,size,isRotate,type)
		}

		//todo not apdateboard
		if (!this.isMovesLisen) {
			this.canvasSection.node.onmousemove = this.moveBinded
			this.isMovesLisen = true
		}
	}

	autoPutShips(shipsToPut: Record<string, number>, board: number[][]) {
		log("AUTO")
		//this.randomShips.actualShips(shipsToPut,board)
		this.isRandomMode=true
		this.isRotated=null
		this.randomShips.putRandomShips(shipsToPut,board)
	}

	clickActions(x: number, y: number) {
		this.addShipToCanvasmage(x, y)
		this.isListenCkick = false
		this.isMovesLisen = false
		this.onResetActiveShip()
	}

	onClick(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		this.canvasSection.node.removeEventListener('mousemove', this.moveBinded)
		this.canvasSection.node.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShipBinded)
		this.clickActions(x, y)
	}

	updateShipOnBoard(shipsOnCanvas: tShipCanvas[]) {
		this.shipsOnCanvas = shipsOnCanvas
	//	console.log("##$$#$",this.shipsOnCanvas)
		this.drawScene()
	}

	addShipToCanvasmage(x: number, y: number, size?: number, isRotate?: boolean, type?: string) {
		this.intersectionController.iterAddToIntersection(x, y, size || this.activeSize, isRotate || this.isRotated)
		this.boardMatrix.clearCells();
		this.fillShipArea(x, y, size || this.activeSize, isRotate)
		const imageObj: tShipCanvas = {
			xC: x, yC: y,
			isRotate: isRotate || this.isRotated, type: type || this.activeShip
		}
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
		if(!this.boardMatrix.isOnBoard(x, y, this.activeSize, this.isRotated)){
			document.body.removeEventListener('keyup', this.rotateShipBinded)
			this.canvasSection.node.removeEventListener('click', this.clickBinded)
			this.isListenCkick = false
		}
		if (this.boardMatrix.isOnBoard(x, y, this.activeSize, this.isRotated)) {
			this.boardMatrix.clearCells()
			this.x = x
			this.y = y
			const isIntersect = this.intersectionController.isIntersection(
				x, y, this.activeSize, this.isRotated)
			const value = !isIntersect ? 'hovered' : 'occupate'
			if (!isIntersect && !this.isListenCkick) {
				document.body.addEventListener('keyup', this.rotateShipBinded)
				this.canvasSection.node.addEventListener('click', this.clickBinded)
				this.isListenCkick = true
			}
			if (isIntersect) {
				this.isListenCkick = false
				this.canvasSection.node.removeEventListener('click', this.clickBinded)
			}
			this.boardMatrix.fillCells(value, x, y, this.activeSize, this.isRotated)
			this.drawScene()
		}
	}

	updateBoard(board: number[][]) {
		this.board = board
		this.boardMatrix.updateBoard(board)
		this.drawScene()
	}

	rotateShip(e: KeyboardEvent) {
		//	console.log("ROTAATE")
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
		this.board.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle =
					cell === 5 ? "olive" :
						cell === 2 ? 'darkGreen' :
							cell === 7 ? "red"
								: "green"
				this.ctx.fillRect((this.boardMatrix.inPixels(cI)) + 1, (this.boardMatrix.inPixels(rI)) + 1,
					this.boardMatrix.cellSize - 2, this.boardMatrix.cellSize - 2);
			})
		})
		this.shipsOnCanvas?.forEach(ship => {
			const axis = ship.isRotate ? 'vertical' : 'horizont'
			const img = this.imagesObj[axis][ship.type]
			this.ctx.drawImage(img, this.boardMatrix.inPixels(ship.xC), this.boardMatrix.inPixels(ship.yC),
				img.width, img.height)
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

	private fillShipArea(x: number, y: number, size: number, isRotate?: boolean) {
		//	console.log("FILLAREA",size)
		const rot = typeof isRotate !== 'undefined' ? isRotate : this.isRotated
//console.log("fillShipAreaRot",rot)
		const areaCells: Set<string> = new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = (!rot) ? x + i : x
			const yCoord = (rot) ? y + i : y
			this.circleStepsFill(yCoord, xCoord, 'blocked').forEach(c => {
				areaCells.add(c)
			})
			this.boardMatrix.valueToCell(yCoord, xCoord, 'ship')
		}
		if(this.isRandomMode) {
			this.randomShips.occupateCells(areaCells)
		}
		this.onFillShipArea(areaCells, this.boardMatrix.getBlockValue())
	}
}

export default CanvasSection
//todo create iage