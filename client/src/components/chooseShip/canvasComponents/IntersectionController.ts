export default class IntersectionController {
	private intersectionData: Set<string>;
	private _isCurrentIntersect: boolean = false;

	constructor() {
		this.intersectionData = new Set()
	}

	isIntersection(x: number, y: number, lngth: number, rotate: boolean) {
		const sAr = []
		for (let i = 0; i < lngth; i++) {
			!rotate
				? sAr.push(this.intersectionData.has(`${y}-${x + i}`))
				: sAr.push(this.intersectionData.has(`${y + i}-${x}`))
		}
		return sAr.some(e => e)
	}

	addToIntersection(coord: string) {
		this.intersectionData.add(coord)
	}

	iterAddToIntersection(x: number, y: number, lngth: number, rotate: boolean) {
		if (!rotate) {
			for (let i = 0; i < lngth; i++) {
				this.intersectionData.add(`${y}-${x + i}`)
			}
		} else {
			for (let i = y; i < lngth; i++) {
				this.intersectionData.add(`${y + i}-${x}`)
			}
		}
	}

	get isCurrentIntersect() {
		return this._isCurrentIntersect
	}
}