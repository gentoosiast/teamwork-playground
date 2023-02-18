import {EmptyAreas} from "../randomAlgorithm";
import {ShipsSizes} from "../../../dto";
import {log} from "../CanvasSection";

export default class RandomShips {
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;
	private generator: Generator<string, void, unknown>;
	onGetCoordinates: (type: string, y: number, x: number, isRotate: boolean) => void
	private isRandomActive: boolean;
	private botShips: Record<string, string|number|boolean>[];
	constructor(isBot?:boolean) {
		this.botShips=[]
		this.ships = null
		this.isRandomActive = false
		this.generator = null
		this.emptyAreas = new EmptyAreas()
		this.emptyAreas.onGetCoordinates =
			(type: string, y: number, x: number, isRotate: boolean) => {
				const shipsSum= Object.values(this.ships).reduce((ac,cur)=>ac+cur,0)
				if(!isBot){
					this.onGetCoordinates(type, y, x, isRotate)
				}else{
					this.botShips.push({type, y, x, isRotate})
				}
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
	interval() {
		const val = this.generator.next().value
		if (val) {
			const isRotate = !!Math.round(Math.random())
			const shipSize = ShipsSizes[val as keyof typeof ShipsSizes]
			this.emptyAreas.generateRandomShip(val, shipSize, isRotate)
		} else {
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
		while (this.interval()) {console.log('1')}
	}

	occupateCells(areaCells: Set<string>) {
	////	console.log("_____occupateCells___")
	//	console.log("AREAcells",areaCells)
		this.emptyAreas.occupateArea(areaCells)
	}
}