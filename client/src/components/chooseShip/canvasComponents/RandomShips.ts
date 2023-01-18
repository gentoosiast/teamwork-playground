import {EmptyAreas} from "../randomAlgorithm";
import {ShipsSizes} from "../ChooseComponent";
import {log} from "../CanvasSection";

export default class RandomShips {
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;
	private generator: Generator<string, void, unknown>;
	private intervalId: any;
	onGetCoordinates: (axis: string, type: string, y: number, x: number, isRotate: boolean) => void
	private isRandomActive: boolean;

	constructor() {
		this.ships = null
		this.isRandomActive = false
		this.generator = null
		this.emptyAreas = new EmptyAreas()
		this.emptyAreas.onGetCoordinates =
			(axis: string, type: string, y: number, x: number, isRotate: boolean) => {
				this.onGetCoordinates(axis, type, y, x, isRotate)
			}
	}

	* genShipsToAuto() {
		const y: string[] = []
		Object.entries(this.ships).forEach(k => {
			for (let i = 0; i < k[1]; i++) {
				y.push(k[0])
			}
		})
		for (let i = 0; i < y.length; i++) {
			yield y[i]
		}
	}
//todo define random metchod and click
	interval() {
		log("interval")
		const val = this.generator.next().value
		//console.log(val,'val')
		if (val) {
			const isRotate = !!Math.round(Math.random())
			const shipSize = ShipsSizes[val as keyof typeof ShipsSizes]
		//	console.log(shipSize,'size','----isRotare=',isRotate)
			this.emptyAreas.generateRandomShip(val, shipSize, isRotate)
		} else {
			clearInterval(this.intervalId)
			return false
		}
		return true
	}
	emptyValues(board:number[][]){
		this.emptyAreas.start(board)
	}
	putRandomShips(shipsToPut: Record<string, number>, board: number[][]) {
		this.ships = shipsToPut
		this.emptyValues(board)
		this.generator = this.genShipsToAuto()
		while (this.interval()) {
			console.log('1')
		}
		//this.interval()
		//this.interval()
	//this.intervalId = setInterval(()=>this.interval(),100)
	}

	occupateCells(areaCells: Set<string>) {
	////	console.log("_____occupateCells___")
	//	console.log("AREAcells",areaCells)
		this.emptyAreas.occupateArea(areaCells)
	}
}