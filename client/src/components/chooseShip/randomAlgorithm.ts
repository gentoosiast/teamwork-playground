type axisData = { id: number, data: number[][], longer: number }

export class EmptyAreas {
	private matrix: number[][];
	private verticalAreas: any[];
	private horizontalAreas: any[];
	onGetCoordinates: (axis: string, type: string, randomItm: number, coords: number[]) => void

	constructor(matrix: number[][]) {
		this.matrix = matrix
		this.verticalAreas = this.arrayDataFromArray('vertical')
		this.horizontalAreas = this.arrayDataFromArray('horizont')
	}

//new Ar??
	isNext(first: number, second: number) {
		return first + 1 === second
	}

	addSubToArray(array: number[], parentArray: number[][]) {
		if (array.length > 0) {
			parentArray.push(array)
			array = []
		}
	}

	arrToSubArr(arr: number[]) {
		const subAr: number[][] = []
		let sm = []
		for (let i = 0; i < arr.length; i++) {
			if (this.isNext(sm[sm.length - 1], arr[i])) {
				this.addSubToArray(sm, subAr)
			}
			sm.push(arr[i])
			if (i + 1 === arr.length) {
				this.addSubToArray(sm, subAr)
			}
		}
		return subAr
	}

	axisData(_axis: string, matrix: number[][]) {
		const arr = []
		for (let i = 0; i < matrix.length; i++) {
			const s: number[] = []
			for (let j = 0; j < matrix[0].length; j++) {
				const value = _axis === 'vertical' ? matrix[j][i] : matrix[i][j]
			}
			arr.push(this.arrToSubArr(s))
		}
		return arr
	}

	longerSub(arr: number[][]) {
		let longer = 0
		arr.forEach(s => {
			if (longer < s.length) longer = s.length
		})
		return longer
	}

	sortByLonger<T extends { longer: number }>(ar: T[]) {
		return ar.sort((a, b) => b.longer - a.longer)
	}

	arrayDataFromArray(value: string) {
		const ar: axisData[] = []
		this.axisData(value, this.matrix).forEach((row, i) => {
			const longer = this.longerSub(row)
			ar.push({id: i, data: row, longer})
		})
		return this.sortByLonger(ar)
	}

//todo MAP ITERATION
	elementsHasntInSet(el: axisData, set: Set<string>) {
		return el.data.flat().filter(num => {
			if (!set.has(`${num}`)) {
				return '' + num
			}
		})
	}

	apdateEmptyAreas(axis: string, d: string[]) {
		const objAxis = axis === 'horizont' ? this.horizontalAreas : this.verticalAreas
		const el = objAxis.find(e => e.id == d[0])
		const setAxis = new Set(d[1].split('-'))
		const rr = this.elementsHasntInSet(el, setAxis)
		const subs = this.arrToSubArr(rr)
		const longer = this.longerSub(subs)
		el.data = this.arrToSubArr(rr)
		el.longer = longer
	}

	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {
		const dAr = Array.from(data)
		dAr.forEach(d => {
			this.apdateEmptyAreas(axis === 'x' ? 'horizont' : 'vertical', d)
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

	putShip(type: string, size: number, isRotate: boolean) {
		const axis = !isRotate ? 'vertical' : 'horizont'
		const objAxis = !isRotate ? this.verticalAreas : this.horizontalAreas
		const suited = objAxis.filter(e => e.longer >= size)
		const randomItm = Math.floor(Math.random() * suited.length)
		const coords = suited[randomItm].data.find((el:[]) => el.length >= size)
		this.onGetCoordinates(axis, type, randomItm, coords)
	}
}