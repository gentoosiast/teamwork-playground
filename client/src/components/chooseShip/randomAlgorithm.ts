export class EmptyAreas {
	private matrix: number[][];
	private verticalAreas: any[];
	private horizontalAreas: any[];
	onGetCoordinates:(axis:string,type:string,randomItm:number,coords:number[])=>void
	constructor(matrix: number[][]) {
		this.matrix = matrix
		this.verticalAreas = this.arrFromArrayV()
		this.horizontalAreas = this.arrFromArrayH()
	}

	arrToSubArr(arr: number[]) {
		const subAr = []
		let sm = []
		for (let i = 0; i < arr.length; i++) {
			if (sm[sm.length - 1] + 1 !== arr[i]) {
				sm.length && subAr.push(sm)
				sm = []
			}
			sm.push(arr[i])
			if (i + 1 === arr.length) {
				subAr.push(sm)
				sm = []
			}
		}
		return subAr
	}

	horizontalData(matrix: number[][]) {
		const bAr = []
		for (let i = 0; i < matrix.length; i++) {
			const s = []
			for (let j = 0; j < matrix[0].length; j++) {

				if (matrix[i][j] === 99) s.push(j)
			}
			bAr.push(this.arrToSubArr(s))
		}
		return bAr
	}

	verticalData(matrix: number[][]) {
		const vAr = []
		for (let i = 0; i < matrix[0].length; i++) {
			const s = []
			for (let j = 0; j < matrix.length; j++) {
				//	console.log(j)
				//	console.log(matrix[j][i])
				if (matrix[j][i] === 99) s.push(j)
			}
			const subAr = []
			let sm = []
			for (let i = 0; i < s.length; i++) {
				if (sm[sm.length - 1] + 1 !== s[i]) {
					sm.length && subAr.push(sm)
					sm = []
				}
				sm.push(s[i])
				if (i + 1 === s.length) {
					subAr.push(sm)
					sm = []
				}
			}
			vAr.push(subAr)
		}
		return vAr
	}

	isRotate() {
		return !!Math.round(Math.random())
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

	arrFromArrayH() {
		const ar:unknown[] = []
	this.horizontalData(this.matrix).forEach((row, i) => {

		const longer = this.longerSub(row)
		ar.push({id: i, data: row, longer})
	})
	return this.sortByLonger(ar)
	}

	arrFromArrayV() {
		const ar = []
		this.verticalData(this.matrix).forEach((col, i) => {
			let longer = 0
			col.forEach(s => {
				if (longer < s.length) longer = s.length
			})
			ar.push({id: i, data: col, longer})
		})
		ar.sort((a, b) => b.longer - a.longer)
		return ar
	}

//todo MAP ITERATION
	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {
		console.log(this.horizontalAreas,'HORR')
		const dAr = Array.from(data)
		if (axis === 'x') {
			dAr.forEach(d => {
				const el = this.horizontalAreas.find(e => e.id == d[0])
				const setAxis = new Set(d[1].split('-'))

				const rr = el.data.flat().filter(num => {
					if (!setAxis.has(`${num}`)) {
						return '' + num
					}
				})
				const subs = this.arrToSubArr(rr)
				const longer= this.longerSub(subs)
				el.data = this.arrToSubArr(rr)
				el.longer=longer
			})
		} else {
			dAr.forEach(d => {
				const el = this.verticalAreas.find(e => e.id == d[0])
			//	console.log(el,'el')
				const setAxis = new Set(d[1].split('-'))
//console.log(setAxis)
				const rr = el.data.flat().filter(num => {
					if (!setAxis.has(`${num}`)) {
						return '' + num
					}
				})
			//	console.log(rr,'rRRRRR')
				const subs = this.arrToSubArr(rr)
				const longer= this.longerSub(subs)
				el.data = this.arrToSubArr(rr)
				el.longer=longer
			})
		}
	//	console.log(this.horizontalAreas, 'Har')

	//	console.log(this.verticalAreas, 'VERTar')
	}

	occupateArea(areaCells: Set<any>) {
		console.log('OCCUPATE')
		console.log(this.horizontalAreas,'1-----Ar')
		console.log(areaCells)
		//console.log(this.verticalAreas, 'VER')
		//console.log(this.horizontalAreas, 'HOR')
		const yS = new Map()
		const xS = new Map()
		Array.from(areaCells).forEach(e => {
			const y = e.split('-')[0]
			const x = e.split('-')[1]
			const valY = yS.has(y) ? yS.get(y) + `-${x}` : `${x}`
			yS.set(y, valY)
			const valX = xS.has(x) ? xS.get(x) + `-${y}` : `${y}`
			xS.set(x, valX)
			// console.log('y-', e.split('-')[0],
			// 	'x-', e.split('-')[1])
		})
		//console.log('x',xS)
		//console.log('y',yS)
		this.deleteFromEmptyAreas('x', xS)
		this.deleteFromEmptyAreas('y', yS)
console.log(this.horizontalAreas,'2-----Ar')
		//console.log(yS, '@')
		//console.log(xS, 'XS')
	}

putShip(type:string,size:number,isRotate:boolean ) {
	//	console.log("PUT<:VAL")
		if(!isRotate){

			const suited = this.verticalAreas.filter(e=>e.longer>=size)
			const randomItm=Math.floor(Math.random()*suited.length)
			const coords=suited[randomItm].data.find(el=>el.length>=size)
			this.onGetCoordinates('vertical',type,randomItm,coords)
		}else{
			const suited = this.horizontalAreas.filter(e=>e.longer>=size)
			const randomItm=Math.floor(Math.random()*suited.length)
			const coords=suited[randomItm].data.find(el=>el.length>=size)
			this.onGetCoordinates('horisont',type,randomItm,coords)
		}
console.log(this.verticalAreas)
	console.log(this.horizontalAreas)
	}
}