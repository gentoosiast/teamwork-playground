import IntersectionController from "./IntersectionController";
import BoardMatrix from "./BoardMatrix";

export default class FillComponent {
	private circleSteps: {x:number,y:number}[];
	private intersectionController: IntersectionController;
	private boardMatrix: BoardMatrix;
	onFillArea:(areaCells:Set<string>)=>void
	constructor(intersection:IntersectionController,boardMatrix:BoardMatrix) {
		this.circleSteps = [
			{x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1},
			{x: 1, y: 0}, {x: -1, y: 0},{x:0,y:0},
			{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}
		]
		this.intersectionController=intersection
		this.boardMatrix=boardMatrix
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

	fillShipArea(x: number, y: number, size: number, isRotate: boolean) {

		const areaCells: Set<string> = new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = (!isRotate) ? x + i : x
			const yCoord = (isRotate) ? y + i : y
			this.circleStepsFill(yCoord, xCoord, 'blocked').forEach(c => {
				areaCells.add(c)
			})
			this.boardMatrix.valueToCell(yCoord, xCoord, 'ship')
		}
		this.onFillArea(areaCells)
	}
}