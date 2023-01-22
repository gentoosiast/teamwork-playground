import Control from "../../../common/controll";
import BoardMatrix from "./canvasComponents/BoardMatrix";
import RandomShips from "./canvasComponents/RandomShips";
import {ShipsSizes} from "./ChooseComponent";
import {imagesObjType} from "../application/app";
import IntersectionController from "./canvasComponents/IntersectionController";
import FillComponent from "./canvasComponents/FillComponent";
import CanvasSectionController from "./canvasComponents/CanvasSectionController";

export const log = function (arg: any) {
	console.log(JSON.parse(JSON.stringify(arg)))
}
export type tShipCanvas = { type: string, isRotate: boolean, xC: number, yC: number }

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private parentNode: HTMLElement;
	private moveBinded: (e: MouseEvent) => void;
	private clickBinded: () => void;
	private rotateShipBinded: any;
	private boardMatrix: BoardMatrix;
	private randomShips: RandomShips;
	private shipsOnCanvas: tShipCanvas[];
	private isRotated: any;
	private activeShip: string;
	private imagesObj: imagesObjType;
	private board: number[][];
	private activeSize: number;
	private onAddShip: (ship: tShipCanvas) => void;
	onRotateShip: () => void
	onFillCells: (fillData: { data: string[], value: number }) => void
	onClearHovered: (value: number) => void
	onResetActiveShip: () => void
	onFillShipArea: (areaCells: Set<string>, value: number) => void
	private createEmptyValues: boolean;
	private isRandomMode: boolean;
	//private fillComponent: FillComponent;
	private canvasSectionController: CanvasSectionController;

	constructor(parentNode: HTMLElement, ships: Record<string, number>, board: number[][],
							isRotated: boolean, activeShip: string,
							shipsOnCanvas: tShipCanvas[], imagesObj: imagesObjType, isAutoPut: boolean,
							onAddShip: (ship: tShipCanvas) => void
	) {
		super(parentNode);
		this.imagesObj = imagesObj
		this.isRandomMode = false
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
		this.createEmptyValues = false
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.canvasSection.node.width = this.boardMatrix.boardWidth
		this.canvasSection.node.height = this.boardMatrix.boardWidth
		this.moveBinded = this.onMove.bind(this)
		this.clickBinded = this.onClick.bind(this)
		this.rotateShipBinded = this.rotateShip.bind(this)
		this.ctx = this.canvasSection.node.getContext('2d')
		this.canvasSectionController=new CanvasSectionController(this.canvasSection.node,this.boardMatrix)
		this.canvasSectionController.onAddShip=(ship)=>this.onAddShip(ship)
		this.canvasSectionController.onFillShipArea = (areaCells) => {
			if (this.isRandomMode) {
				this.randomShips.occupateCells(areaCells)
			}
			this.onFillShipArea(areaCells, this.boardMatrix.getBlockValue())
		}
		this.drawScene()
		this.randomShips = new RandomShips()
		this.randomShips.onGetCoordinates = (type: string,
																				 y: number, x: number, isRotate: boolean) => {
			const size = ShipsSizes[type as keyof typeof ShipsSizes]
			this.canvasSectionController.addShipImg(x, y, size, isRotate, type)
		}
		this.canvasSection.node.onmousemove = this.moveBinded
	}

	autoPutShips(shipsToPut: Record<string, number>, board: number[][]) {
		this.isRandomMode = true
		this.isRotated = null
		this.randomShips.putRandomShips(shipsToPut, board)
	}


	onClick(e: MouseEvent) {
		this.canvasSection.node.removeEventListener('mousemove', this.moveBinded)
		this.canvasSection.node.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShipBinded)
		this.canvasSectionController.onClick(e,this.activeSize,this.isRotated,this.activeShip)
		this.drawScene()
		this.onResetActiveShip()
	}

	updateShipOnBoard(shipsOnCanvas: tShipCanvas[]) {
		this.shipsOnCanvas = shipsOnCanvas
		this.drawScene()
	}

	addActiveShip(ship: string) {
		this.activeShip = ship
		this.activeSize = ShipsSizes[ship as keyof typeof ShipsSizes]
	}

	setRotate(rotate: boolean) {this.isRotated = rotate}

	onMove(e: MouseEvent) {
		const notOnBoard=this.canvasSectionController.onMove(e,this.activeSize,this.isRotated)
		if(notOnBoard){
			document.body.removeEventListener('keyup', this.rotateShipBinded)
			this.canvasSection.node.removeEventListener('click', this.clickBinded)
		}else{
			document.body.addEventListener('keyup', this.rotateShipBinded)
			this.canvasSection.node.addEventListener('click', this.clickBinded)
		}
		this.drawScene()
	}

	updateBoard(board: number[][]) {
		this.board = board
		this.boardMatrix.updateBoard(board)
		this.drawScene()
	}

	rotateShip(e: KeyboardEvent) {
		const keyName = e.code;
		if (keyName === 'Space') {
			this.onRotateShip()
			this.canvasSectionController.rotateShip(this.activeSize, this.isRotated)
			this.drawScene()
		}
	}

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
}

export default CanvasSection