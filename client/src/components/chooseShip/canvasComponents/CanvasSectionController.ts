import FillComponent from "./FillComponent";
import IntersectionController from "./IntersectionController";
import BoardMatrix from "./BoardMatrix";

export default class CanvasSectionController {
	private intersectionController: IntersectionController;
	private fillComponent: FillComponent;
	private boardMatrix: BoardMatrix;
	onFillShipArea: (areaCells: Set<string>) => void
	//private canvas: HTMLCanvasElement;
	private isMovesLisen: boolean;
	private isListenCkick: boolean;
	private x: number;
	private y: number;
	onAddShip: (img: { xC: number, yC: number, isRotate: any, type: any }) => void

	constructor( board: BoardMatrix) {
		this.intersectionController = new IntersectionController()
		this.fillComponent = new FillComponent(this.intersectionController, board)
		this.fillComponent.onFillArea = (areaCells) => {
			this.onFillShipArea(areaCells)
		}
		this.boardMatrix = board
		this.isMovesLisen = false
		this.isListenCkick = false

		if (!this.isMovesLisen) {
			this.isMovesLisen = true
		}
	}

	addShipToCanvasmage(x: number, y: number, size: number, isRotate: boolean, type: string) {
		this.intersectionController.iterAddToIntersection(x, y, size, isRotate)
		this.boardMatrix.clearCells();
		this.fillComponent.fillShipArea(x, y, size || size, isRotate)
		return {
			xC: x, yC: y,
			isRotate: isRotate, type: type
		}
	}



	onClick(x:number,y:number, size: number, isRotated: boolean, type: string) {
	//	const {x, y} = this.getCursorPosition(e, this.canvas)
		this.isListenCkick = false
		this.isMovesLisen = false
		this.addShipImg(x, y, size, isRotated, type)
	}

	addShipImg(x: number, y: number, size: number, isRotated: boolean, type: string) {
		const imgOb = this.addShipToCanvasmage(x, y, size, isRotated, type)
		this.onAddShip(imgOb)
	}

	onMove(x:number,y:number, activeSize: number, isRotated: boolean) {
	//	const {x, y} = this.getCursorPosition(e, this.canvas)
		if (!this.boardMatrix.isOnBoard(x, y, activeSize, isRotated)) {
			this.isListenCkick = false
			return true
		}
		if (this.boardMatrix.isOnBoard(x, y, activeSize, isRotated)) {
			this.x = x
			this.y = y
			const isIntersect = this.intersectionController.isIntersection(
				x, y, activeSize, isRotated)
			const value = !isIntersect ? 'hovered' : 'occupate'
			this.isListenCkick = !isIntersect
			this.boardMatrix.fillCell(value, x, y, activeSize, isRotated)
			return isIntersect||(!isIntersect && !this.isListenCkick)
		}
	}
	rotateShip(size: number, isRotated: boolean) {
		this.boardMatrix.fillCell('hovered', this.x, this.y, size, isRotated)
	}
}