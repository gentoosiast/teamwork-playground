import {ShipsSizes} from "../ChooseComponent";
import {EmptyAreas} from "../randomAlgorithm";

export default class RandomShips {
	private matrix: number[][];
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;
	private generator: Generator<string, void, unknown>;
	private putShipBinded: any;
	private intervalId: any;
	onGetCoordinates:(axis:string,type:string,randomItm:number,coords:number[])=>void
	constructor(matrix: number[][], ships: Record<string, number>) {
		this.matrix = matrix
//this.putShipBinded= this.putShip.bind(this)
		//ShipSizes
		//ShipsCount
		this.ships = ships
		this.generator = this.genShipsToAuto()
		this.emptyAreas = new EmptyAreas(matrix)
		this.emptyAreas.onGetCoordinates=(axis:string,type:string,randomItm:number,coords:number[])=>{
			this.onGetCoordinates(axis,type,randomItm,coords)
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

	// putShip(shipSize:number,isRotate:boolean){
	// 	this.emptyAreas.putShip(val,shipSize,isRotate)
	// }
	interval(){
		const val=this.generator.next().value
		console.log(val,'VAL')
		if(val){
			const isRotate=!!Math.round(Math.random())
			const shipSize=ShipsSizes[val as keyof typeof ShipsSizes]
			this.emptyAreas.putShip(val,shipSize,isRotate)
		}else{
			clearInterval(this.intervalId)
		}
	}
	putRandomShips() {
		this.intervalId=setInterval(()=> {

		  this.interval()
		// // this.interval()
		// // this.interval()
		// // this.interval()

				},1000)
	}

	occupateCells(areaCells: Set<string>) {
		this.emptyAreas.occupateArea(areaCells)
	}
}