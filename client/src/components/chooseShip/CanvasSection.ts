import Control from "../../../common/controll";
import BoardMatrixChooseShips from "./canvasComponents/BoardMatrix";
import RandomShips from "./canvasComponents/RandomShips";
import {ShipsSizes,tShipCanvas} from "../../dto";
import {imagesObjType} from "../application/app";
import CanvasSectionController from "./canvasComponents/CanvasSectionController";
import BoardComponent from "./canvasComponents/BoardComponent";

export const log = function (arg: any) {
	console.log(JSON.parse(JSON.stringify(arg)))
}
export class CanvasSection extends Control {
	private parentNode: HTMLElement;
	private moveBinded: (e: MouseEvent) => void;
	private clickBinded: () => void;
	private rotateShipBinded: any;
	private boardMatrix: BoardMatrixChooseShips;
	private randomShips: RandomShips;
	private shipsOnCanvas: tShipCanvas[];
	private isRotated: any;
	private activeShip: string;
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
	private canvasSectionController: CanvasSectionController;
	private boardComponent: BoardComponent;
	constructor(parentNode: HTMLElement, ships: Record<string, number>, board: number[][],
							isRotated: boolean, activeShip: string,
							shipsOnCanvas: tShipCanvas[], imagesObj: imagesObjType, isAutoPut: boolean,
							onAddShip: (ship: tShipCanvas) => void
	) {
		super(parentNode);
		this.isRandomMode = false
		this.isRotated = false
		this.activeShip = activeShip
		this.activeSize = ShipsSizes[this.activeShip as keyof typeof ShipsSizes]
		this.board = board
		this.boardMatrix = new BoardMatrixChooseShips(this.board)
		this.boardComponent = new BoardComponent(this.node, 10, 10, this.boardMatrix.cellSize, imagesObj)
		this.boardMatrix.onClearHovered = (value: number) => this.onClearHovered(value)
		this.boardMatrix.onFillCells = (fillData: { data: string[], value: number }) => {
			this.onFillCells(fillData)
		}
		this.onAddShip = onAddShip
		this.parentNode = parentNode
		this.createEmptyValues = false
		this.moveBinded = this.onMove.bind(this)
		this.clickBinded = this.onClick.bind(this)
		this.rotateShipBinded = this.rotateShip.bind(this)
		this.canvasSectionController = new CanvasSectionController(this.boardMatrix)
		this.canvasSectionController.onAddShip = (ship) => this.onAddShip(ship)
		this.canvasSectionController.onFillShipArea = (areaCells) => {
			if (this.isRandomMode) {
				this.randomShips.occupateCells(areaCells)
			}
			this.onFillShipArea(areaCells, this.boardMatrix.getBlockValue())
		}
		this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
		this.randomShips = new RandomShips()
		this.randomShips.onGetCoordinates = (type: string,
																				 y: number, x: number, isRotate: boolean) => {
			const size = ShipsSizes[type as keyof typeof ShipsSizes]
			this.canvasSectionController.addShipImg(x, y, size, isRotate, type)
		}
		this.boardComponent.canvas.onmousemove = this.moveBinded
	}

	autoPutShips(shipsToPut: Record<string, number>, board: number[][]) {
		this.isRandomMode = true
		this.isRotated = null
		this.randomShips.putRandomShips(shipsToPut, board)
	}

	onClick(e: MouseEvent) {
		const {x, y} = this.boardMatrix.getCursorPosition(e, this.boardComponent.node)
		this.boardComponent.canvas.removeEventListener('mousemove', this.moveBinded)
		this.boardComponent.canvas.removeEventListener('click', this.clickBinded)
		document.body.removeEventListener('keyup', this.rotateShipBinded)
		this.canvasSectionController.onClick(x, y, this.activeSize, this.isRotated, this.activeShip)

		this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
		this.onResetActiveShip()
	}

	updateShipOnBoard(shipsOnCanvas: tShipCanvas[]) {
		this.shipsOnCanvas = shipsOnCanvas
		this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
	}

	addActiveShip(ship: string) {
		this.activeShip = ship
		this.activeSize = ShipsSizes[ship as keyof typeof ShipsSizes]
	}

	setRotate(rotate: boolean) {
		this.isRotated = rotate
	}

	onMove(e: MouseEvent) {
		const {x, y} = this.boardMatrix.getCursorPosition(e, this.boardComponent.node)
		const notOnBoard = this.canvasSectionController.onMove(x, y, this.activeSize, this.isRotated)
		if (notOnBoard) {
			document.body.removeEventListener('keyup', this.rotateShipBinded)
			this.boardComponent.canvas.removeEventListener('click', this.clickBinded)
		} else {
			document.body.addEventListener('keyup', this.rotateShipBinded)
			this.boardComponent.canvas.addEventListener('click', this.clickBinded)
		}

		this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
	}

	updateBoard(board: number[][]) {
		this.board = board
		this.boardMatrix.updateBoard(board)
		this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
	}

	rotateShip(e: KeyboardEvent) {
		const keyName = e.code;
		if (keyName === 'Space') {
			this.onRotateShip()
			this.canvasSectionController.rotateShip(this.activeSize, this.isRotated)
			this.boardComponent.drawScene(this.board, this.shipsOnCanvas)
		}
	}
}

export default CanvasSection