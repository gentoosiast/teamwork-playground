import {EmptyAreas} from "./randomAlgorithm";
import {IShip, ShipType} from "../../dto";

interface IGen<T = string, TReturn = void, TNext = unknown>
	extends Iterator<T, TReturn, TNext> {
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>;

	return(value: TReturn): IteratorResult<T, TReturn>;

	throw(e: any): IteratorResult<T, TReturn>;

	[Symbol.iterator](): Generator<T, TReturn, TNext>;
}

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

	constructor(ships: Record<string, number>) {
		this.botShips = []
		this.ships = ships
		this.isRandomActive = false

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
		this.emptyValues(board)
		const shipsArr = []
		const s = this.getShipsItems()
		s.forEach(ss => {
			const direction = !!Math.round(Math.random())
			const shipSize = ShipsSizes[ss as keyof typeof ShipsSizes]
			shipsArr.push(this.emptyAreas.generateRandomShip(ss, shipSize, direction))
		})
		return shipsArr;
	}

	occupateCells(areaCells: Set<string>) {
		////	console.log("_____occupateCells___")
		//	console.log("AREAcells",areaCells)
		this.emptyAreas.occupateArea(areaCells)
	}
}