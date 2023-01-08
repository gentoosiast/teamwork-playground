export class EmptyAreas {
	private matrix: number[][];
	private verticalAreas: any[];
	private horizontalAreas: any[];

	constructor(matrix: number[][]) {
		this.matrix = matrix
		this.verticalAreas = this.arrFromArrayV()
		this.horizontalAreas = this.arrFromArrayH()
	}

	horizontalData(matrix: number[][]) {
		const bAr = []
		for (let i = 0; i < matrix.length; i++) {
			const s = []
			for (let j = 0; j < matrix[0].length; j++) {
				//	console.log(j,'J')
				if (matrix[i][j] === 99) s.push(j)
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
			bAr.push(subAr)
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

	arrFromArrayH() {
		const ar = []
		this.horizontalData(this.matrix).forEach((row, i) => {
			let longer = 0
			row.forEach(s => {
				if (longer < s.length) longer = s.length
			})
			ar.push({id: i, data: row, longer})
		})
		ar.sort((a, b) => b.longer - a.longer)
		return ar
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

	deleteFromEmptyAreas(axis: string, data: Map<string, string>) {

	}

	occupateArea(areaCells: Set<any>) {
		console.log(this.verticalAreas, 'VER')
		console.log(this.horizontalAreas, 'HOR')
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
		this.deleteFromEmptyAreas('x', xS)
		this.deleteFromEmptyAreas('y', yS)

		console.log(yS, '@')
		console.log(xS, 'XS')
	}
}