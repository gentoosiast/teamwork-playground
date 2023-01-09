type axisData = { id: number, data: number[][], longer: number }

export class EmptyAreas {
	private matrix: number[][];
	private verticalAreas: any[];
	private horizontalAreas: any[];
	onGetCoordinates: (axis: string, type: string, y: number, x: number) => void

	constructor() {
		this.matrix = null
		this.verticalAreas = null
		this.horizontalAreas = null
	}

	start(matrix: number[][]) {
		this.matrix = matrix
		this.verticalAreas = this.arrayDataFromArray('vertical')
		this.horizontalAreas = this.arrayDataFromArray('horizont')
	}

//new Ar??
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

	axisData(_axis: string, matrix: number[][]) {
		const arr = []
		for (let i = 0; i < matrix.length; i++) {
			const s: number[] = []
			for (let j = 0; j < matrix[0].length; j++) {
				const value = _axis === 'vertical' ? matrix[j][i] : matrix[i][j]
				if (value === 99) s.push(j)
			}
			const t = this.arrToSubArr(s)
			arr.push(t)
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
		const r = this.axisData(value, this.matrix)
		r.forEach((row, i) => {
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
	//	console.log(objAxis, '!!ObjAxis')
		const el = objAxis.find(e => e.id == d[0])
		const idx=objAxis.indexOf(el)
		//console.log("EL", el)
		 const setAxis = new Set(d[1].split('-'))
		 const rr = this.elementsHasntInSet(el, setAxis)
		//console.log(rr,'elementsHasntInSet')
		 const subs = this.arrToSubArr(rr)
		 const longer = this.longerSub(subs)
		objAxis.splice(idx,1,{id:el.id,data:this.arrToSubArr(rr),longer})
		// el.data = this.arrToSubArr(rr)
		// el.longer = longer
	}

	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {
		//console.log("deleteFromEmptyAreas    axis", axis)
		const dAr = Array.from(data)
		const ax=axis === 'x' ? 'horizont' : 'vertical'
		dAr.forEach(d => {
		//	console.log(d, 'DD')
			this.apdateEmptyAreas(ax, d)
		})

		console.log(this.horizontalAreas,'ELNEWWW')
	}

	occupateArea(areaCells: Set<any>) {
		console.log("OCUPATEAREA")
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
//console.log(yS,'YY')
//		console.log(xS,'XXX')
		this.deleteFromEmptyAreas('x', xS)
		this.deleteFromEmptyAreas('y', yS)
	//	console.log(this.horizontalAreas,'H')
	//	console.log(this.verticalAreas,'V')
	}

	putShip(type: string, size: number, isRotate: boolean) {
		//console.log("ISrotate",isRotate)
		const axis = isRotate ? 'vertical' : 'horizont'
		//e.log("CURRENTAxis",axis)
		const objAxis = isRotate ? this.verticalAreas : this.horizontalAreas
		//console.log(objAxis, 'ObjAxis')
		const suited = objAxis.filter(e => e.longer >= size)
		//e.log(suited, 'SUITED')
		const randomItm = Math.floor(Math.random() * suited.length)
		//console.log(randomItm,'RANDitm')
		const coords = suited[randomItm].data.find((el: []) => el.length >= size)
		//e.log(coords)
		const x = !isRotate ? randomItm : coords[Math.floor(Math.random() * (coords.length - size))]
		const y = !isRotate ? coords[Math.floor(Math.random() * (coords.length - size))] : randomItm
		//	console.log('y-',y,'x-',x)
		this.onGetCoordinates(axis, type, y, x)
	}
}