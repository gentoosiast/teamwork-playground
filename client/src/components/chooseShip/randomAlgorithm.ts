import {log} from "./CanvasSection";
type tSuitedItem={id:number,data:number[][],longer:number}

type axisData = { id: number, data: number[][], longer: number }
export class EmptyAreas {
	private matrix: number[][];
	onGetCoordinates: (type: string, y: number, x: number, isRotate: boolean) => void
	private notRotatedAreas: axisData[];
	private rotatedAreas: axisData[];
	private forSmallShips: tSuitedItem[];

	constructor() {
		this.matrix = null
		this.forSmallShips=[]
	}

	start(matrix: number[][]) {
		this.matrix = matrix
		this.notRotatedAreas = this.arrayDataFromArray('horizont', matrix)
		this.rotatedAreas = this.arrayDataFromArray('vertical', matrix)
	}

	isNext(first: number, second: number) {
		return first + 1 === second
	}

	arrToSubArr(arr: number[]) {
		const subAr: number[][] = []
		let sm = []
		for (let i = 0; i < arr.length; i++) {
			if (!sm.length) sm.push(arr[i])
			else {
				if (this.isNext(sm[sm.length - 1], arr[i])) {
					sm.push(arr[i])
				} else {
					subAr.push(sm)
					sm = []
					sm.push(arr[i])
				}
			}
			if (i + 1 === arr.length && !!sm.length) {
				subAr.push(sm)
			}
		}
		return subAr
	}

	axisData(_axis: string, matrix: number[][]):number[][][] {
		const arr:number[][][] = []
		for (let i = 0; i < matrix.length; i++) {
			const s: number[] = []
			for (let j = 0; j < matrix[0].length; j++) {
				const value = _axis === 'vertical' ? matrix[j][i] : matrix[i][j]
				if (value === 0) s.push(j)
			}
			const t = this.arrToSubArr(s)
			arr.push(t)
		}
		return arr
	}

	longerSub(arr: number[][]):number {
		let longer = 0
		arr.forEach(s => {
			if (longer < s.length) longer = s.length
		})
		return longer
	}

	sortByLonger<T extends { longer: number }>(ar: T[]) {
		return ar.sort((a, b) => b.longer - a.longer)
	}

	arrayDataFromArray(value: string, board: number[][]) {
		const ar: axisData[] = []
		const r = this.axisData(value, board)
		r.forEach((row, i) => {
			const longer = this.longerSub(row)
			ar.push({id: i, data: row, longer})
		})
		return this.sortByLonger(ar)
	}

	elementsHasntInSet(el: axisData, set: Set<string>) {
		return el.data.flat().filter(num => {
			if (!set.has(`${num}`)) {
				return '' + num
			}
		})
	}

	apdateEmptyAreas(axis: string, d: string[]) {
		const objAxis = axis === 'y' ? this.notRotatedAreas : this.rotatedAreas
		const el = objAxis.find(e => e.id == +d[0])
		const idx = objAxis.indexOf(el)
		const setAxis = new Set(d[1].split('-'))
		const rr = this.elementsHasntInSet(el, setAxis)
		const subs = this.arrToSubArr(rr)
		const longer = this.longerSub(subs)

		objAxis.splice(idx, 1, {id: el.id, data: this.arrToSubArr(rr), longer})
		el.data = this.arrToSubArr(rr)
		el.longer = longer
	}

	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {
		const dAr = Array.from(data)
		dAr.forEach(d => {
			this.apdateEmptyAreas(axis, d)
		})
	}

	occupateArea(areaCells: Set<any>) {
		const yS = new Map()
		const xS = new Map()
		Array.from(areaCells).forEach(e => {
			const y = e.split('-')[0]
			const x = e.split('-')[1]
			const valY = yS.has(y) ? yS.get(y) + `-${x}` : `${x}`
			yS.set(y, valY)
			const valX = xS.has(x) ? xS.get(x) + `-${y}` : `${y}`
			xS.set(x, valX)
		})
		this.deleteFromEmptyAreas('x', xS)
		this.deleteFromEmptyAreas('y', yS)
	}

	generateRandomShip(type: string, size: number, isRotate: boolean) {
		console.log('GENERATERANDOM', type, size, isRotate,JSON.parse(JSON.stringify(this.rotatedAreas)))
		const objAxis = isRotate ? JSON.parse(JSON.stringify(this.rotatedAreas))
			: JSON.parse(JSON.stringify(this.notRotatedAreas))
		const suited:tSuitedItem[] = objAxis.filter((e: axisData) => e.longer >= size)
		const randomItm = Math.round(Math.random() * (suited.length - 1))
		const coords = suited[randomItm].data.find((el: []) => el.length >= size)
		const x = !isRotate ? coords[Math.floor(Math.random() * (coords.length - size))] : suited[randomItm].id
		const y = !isRotate ? suited[randomItm].id : coords[Math.floor(Math.random() * (coords.length - size))]
		this.onGetCoordinates(type, y, x, isRotate)
	}
}