import FillComponent from "./FillComponent";
import IntersectionController from "./IntersectionController";
import BoardMatrix from "./BoardMatrix";

export default class CanvasSectionController{
	private intersectionController: IntersectionController;
	private fillComponent: FillComponent;
	private boardMatrix: BoardMatrix;
	onFillShipArea:(areaCells:Set<string>)=>void
	private canvas: HTMLCanvasElement;
	private isMovesLisen: boolean;
	private isListenCkick: boolean;
	private x: number;
	private y: number;
	onAddShip:(img: {xC: number, yC: number, isRotate: any, type: any})=>void
	constructor(canvas:HTMLCanvasElement,board:BoardMatrix) {
		this.canvas=canvas
		this.intersectionController = new IntersectionController()
		this.fillComponent = new FillComponent(this.intersectionController,board)
		this.fillComponent.onFillArea = (areaCells) => {
			this.onFillShipArea(areaCells)
		}
		this.boardMatrix=board
		this.isMovesLisen = false
		this.isListenCkick = false

		if (!this.isMovesLisen) {
			this.isMovesLisen = true
		}
	}
	addShipToCanvasmage(x: number, y: number, size: number, isRotate: boolean, type: string) {
		this.intersectionController.iterAddToIntersection(x, y, size, isRotate )
		this.boardMatrix.clearCells();
		this.fillComponent.fillShipArea(x, y, size || size, isRotate)
		return {
			xC: x, yC: y,
			isRotate: isRotate , type: type
		}
	}
	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		return this.boardMatrix.getCurrentCell(x, y)
	}
	onClick(e:MouseEvent,size:number,isRotated:boolean,type:string){
		const {x, y} = this.getCursorPosition(e, this.canvas)
		this.isListenCkick = false
		this.isMovesLisen = false
		this.addShipImg(x, y,size,isRotated,type)
	}
addShipImg(x:number,y:number,size:number,isRotated:boolean,type:string){
	const imgOb = this.addShipToCanvasmage(x, y,size,isRotated,type)
	this.onAddShip(imgOb)
}
	onMove(e: MouseEvent,activeSize:number,isRotated:boolean) {
		const {x, y} = this.getCursorPosition(e, this.canvas)
		if (!this.boardMatrix.isOnBoard(x, y, activeSize, isRotated)) {
			this.isListenCkick = false
			return true
		}
		if (this.boardMatrix.isOnBoard(x, y,activeSize, isRotated)) {
			this.x = x
			this.y = y
			const isIntersect = this.intersectionController.isIntersection(
				x, y, activeSize, isRotated)
			const value = !isIntersect ? 'hovered' : 'occupate'
			if (!isIntersect && !this.isListenCkick) {
				this.isListenCkick = true
				return true
			}
			if (isIntersect) {
				this.isListenCkick = false
				return true
			}
			this.boardMatrix.fillCell(value, x, y, activeSize, isRotated)
			return false
		}
	}
	rotateShip(size:number,isRotated:boolean) {
		this.boardMatrix.fillCell('hovered', this.x, this.y, size, isRotated)
	}
}