import {EmptyAreas} from "../randomAlgorithm";
import {ShipsSizes} from "../ChooseComponent";

export default class RandomShips {
	private matrix: number[][];
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;
	private generator: Generator<string, void, unknown>;
	private intervalId: any;
	onGetCoordinates: (axis: string, type: string, y: number, x: number) => void
	private isRandomActive: boolean;

	constructor(matrix: number[][]) {
		this.matrix = matrix
		this.ships = null
		this.isRandomActive = false
		this.generator = this.genShipsToAuto()
		this.emptyAreas = new EmptyAreas()
		this.emptyAreas.onGetCoordinates =
			(axis: string, type: string, y: number, x: number) => {
				this.onGetCoordinates(axis, type, y, x)
			}
	}

	actualShips(ships: Record<string, number>) {
		this.ships = ships
		console.log(this.ships,'EERRERR')
	}

	* genShipsToAuto() {
		const y: string[] = []
		Object.entries(this.ships).forEach(k => {
			for (let i = 0; i < k[1]; i++) {
				y.push(k[0])
			}
		})
		//console.log(y,'$')
		for (let i = 0; i < y.length; i++) {
			yield y[i]
		}
	}
//images
	//
	interval() {
		const val = this.generator.next().value
		if (val) {
			const isRotate = !!Math.round(Math.random())
			const shipSize = ShipsSizes[val as keyof typeof ShipsSizes]
			this.emptyAreas.putShip(val, shipSize, isRotate)
		} else {
			//clearInterval(this.intervalId)
			return false
		}
		return true
	}

	putRandomShips() {
		this.isRandomActive = true
		this.emptyAreas.start(this.matrix)
		// for(let i=0;i<8;i++){
		// 	this.interval()
		// }
		//this.intervalId = setInterval(() => {
		while (this.interval()){ console.log('1')}
		// 	// setTimeout(()=>this.interval(),500)
		// 	//	}, 100)
		// 	}
	}
	occupateCells(areaCells: Set<string>) {
		this.isRandomActive && this.emptyAreas.occupateArea(areaCells)
	}

	updateBoard(board: number[][]) {
		this.matrix=board
	}
}