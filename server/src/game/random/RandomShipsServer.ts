import {EmptyAreas} from "./randomAlgorithm";
import {IShip, ShipType} from "../../dto";
import {log} from "../../../../client/src/components/chooseShip/CanvasSection";

export enum ShipsSizes {
	small = 1,
	medium,
	large,
	huge
}

export default class RandomShipsServer {
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;
	private isRandomActive: boolean;
	private botShips: IShip[];
	//private generator: ()=>IGen;
	// @ts-ignore
	onBotRandomShips: (ships: IShip[]) => void
	private circleSteps: { x: number; y: number }[];

	constructor(ships: Record<string, number>) {
		this.botShips = []
		this.ships = ships
		this.isRandomActive = false
		this.circleSteps = [
			{x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1},
			{x: 1, y: 0}, {x: -1, y: 0},{x:0,y:0},
			{x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -1}
		]
		this.emptyAreas = new EmptyAreas()
		this.emptyAreas.onGetCoordinates =
			(type: string, y: number, x: number, isRotate: boolean) => {
				const shipsSum = Object.values(this.ships).reduce((ac, cur) => ac + cur, 0)
				this.botShips.push(
					{
						position: {x, y},
						direction: isRotate,
						length: ShipsSizes[type as keyof typeof ShipsSizes],
						type: type as ShipType
					}
				)
				if (shipsSum === this.botShips.length) {
					this.onBotRandomShips(this.botShips)
				}
			}
	}

	getShipsItems() {
		const y: string[] = []
		Object.entries(this.ships).forEach(k => {
			for (let i = 0; i < k[1]; i++) {
				y.push(k[0])
			}
		})
		return y
	}

	emptyValues(board: number[][]) {
		this.emptyAreas.start(board)
	}

	putRandomShips(board: number[][]) {
		log("put--RandomShips")
		this.emptyValues(board)
		const shipsArr:IShip[] = []
		const s = this.getShipsItems()
		s.forEach(ss => {
			const direction = !!Math.round(Math.random())
			const shipSize = ShipsSizes[ss as keyof typeof ShipsSizes]
			const coords=this.emptyAreas.generateRandomShip(ss, shipSize, direction)
			//log(coords)
			shipsArr.push(coords)
			this.fillShipArea(coords.position.x,coords.position.y,coords.length,coords.direction)
		})
		return shipsArr;
	}
	fillShipArea(x: number, y: number, size: number, isRotate: boolean) {
		const areaCells: Set<string> = new Set()
		for (let i = 0; i < size; i++) {
			const xCoord = (!isRotate) ? x + i : x
			const yCoord = (isRotate) ? y + i : y
			this.circleSteps.forEach(c => {
				if(xCoord+c.x<0||yCoord+c.y<0||xCoord+c.x>=10||yCoord+c.y>=10)return
				areaCells.add(`${xCoord+c.x}-${yCoord+c.y}`)
			})
		}
		this.emptyAreas.occupateArea(areaCells)
	}
}