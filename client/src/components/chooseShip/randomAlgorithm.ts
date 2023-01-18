import {log} from "./CanvasSection";

type axisData = { id: number, data: number[][], longer: number }

export class EmptyAreas {
	private matrix: number[][];
	private verticalAreas: any[];
	private horizontalAreas: any[];
	onGetCoordinates: (axis: string, type: string, y: number, x: number,isRotate:boolean) => void

	constructor() {
		this.matrix = null
		this.verticalAreas = null
		this.horizontalAreas = null
	}

	start(matrix: number[][]) {
		this.matrix = matrix
		//***** logic Mistake
		this.verticalAreas = this.arrayDataFromArray('horizont',matrix)
		this.horizontalAreas = this.arrayDataFromArray('vertical',matrix)
		// log("VV--HH")
		// log(this.verticalAreas)
		// log(this.horizontalAreas)
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

	axisData(_axis: string, matrix: number[][]) {
		const arr = []
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

	arrayDataFromArray(value: string,board:number[][]) {
		//console.log(value)
		const ar: axisData[] = []
		const r = this.axisData(value, board)
		//console.log("R",r)
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
		//console.log("UPDATE EMPTY AREAS",axis)
		console.log(this.horizontalAreas)
		const objAxis = axis === 'horizont' ? this.horizontalAreas : this.verticalAreas
		console.log(JSON.parse(JSON.stringify(objAxis)), '!!ObjAxis')
		 const el = objAxis.find(e => e.id == d[0])
		const idx = objAxis.indexOf(el)
		//console.log("EL", el)
		const setAxis = new Set(d[1].split('-'))
		const rr = this.elementsHasntInSet(el, setAxis)
	//	console.log(rr,'elementsHasntInSet')
		const subs = this.arrToSubArr(rr)
		const longer = this.longerSub(subs)

		objAxis.splice(idx, 1, {id: el.id, data: this.arrToSubArr(rr), longer})
		//console.log(JSON.parse(JSON.stringify(objAxis)), '22222----!!ObjAxis')
		el.data = this.arrToSubArr(rr)
		el.longer = longer
	//	console.log("APDT",JSON.parse(JSON.stringify(objAxis)))
	}

	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {
		//console.log("DDDdeleteFromEmptyAreas    axis",axis)
		const dAr = Array.from(data)
		//console.log("DARRRRR",dAr)
		const ax = axis === 'x' ? 'horizont' : 'vertical'
	//	console.log(ax,'AXX')
		dAr.forEach(d => {
		//		console.log(d, 'DD')
			this.apdateEmptyAreas(ax, d)
		})
	}

	occupateArea(areaCells: Set<any>) {
		console.log("OCUPATEAREA")
		//	console.log("OCset",areaCells)
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
		console.log('x', xS)
		console.log('y', yS)
		 this.deleteFromEmptyAreas('x', xS)
		 this.deleteFromEmptyAreas('y', yS)
		log("HORIZONT and VERTIC areac")
		log(this.horizontalAreas)
		log(this.verticalAreas)
	//	console.log(this.horizontalAreas, '-----H')
	//	console.log(this.verticalAreas, '------V')
	}

	generateRandomShip(type: string, size: number, isRotate: boolean) {
		console.log("RANDOMMM44444")
		const axis = isRotate ? 'vertical' : 'horizont'
		console.log("CURRENTAxis", axis,isRotate)
		const objAxis = isRotate ? this.horizontalAreas :this.verticalAreas
		//const objAxis = isRotate ? this.verticalAreas : this.horizontalAreas
		console.log(JSON.parse(JSON.stringify(objAxis)), 'ObjAxis')
		const suited = objAxis.filter(e => e.longer >= size)
		console.log(JSON.parse(JSON.stringify(suited)), 'SUITED')
		const randomItm = Math.floor(Math.random() * suited.length)
		//console.log(randomItm,'RANDitm')
		const coords = suited[randomItm].data.find((el: []) => el.length >= size)
		 //console.log(coords,'coords')
		//
		// //console.log('NEWshipData',JSON.parse(JSON.stringify({size, suited, randomItm, coords, axis})))
		// console.log(coords.length - size,'coords.length - size')
		//horizont=> take row(y-random)=>
		const x = !isRotate ? coords[Math.floor(Math.random() * (coords.length - size))]:suited[randomItm].id
		const y = !isRotate ? suited[randomItm].id:coords[Math.floor(Math.random() * (coords.length - size))]
			//console.log(x,y)
		console.log('y-', y, 'x-', x)
	//	log({y,x,type,size,isRotate,axis})
	//	console.log('NEWshipData',y,x,type,size,isRotate,axis)
		this.onGetCoordinates(axis, type, y, x,isRotate)
	}
}