import {ShipsSizes} from "../ChooseComponent";
import {EmptyAreas} from "../randomAlgorithm";

export default class RandomShips{
	private matrix: number[][];
	private ships: Record<string, number>;
	private emptyAreas: EmptyAreas;

	constructor(matrix: number[][], ships: Record<string,number>) {
		this.matrix=matrix

		//ShipSizes
		//ShipsCount
		this.ships=ships
		const generator= this.genShipsToAuto()
	this.emptyAreas=	new EmptyAreas(matrix)
	}

//4-[[00,10,20,30][10,20,30,40]]
	//3-[[00,10,20],[10,20,30]]

	//1 - {maxLen:4, data:[new Set(1,2,3,4),new Set(6,7,8,9)]}
	//2 - {maxLen:2, data:[new Set(1,2),new Set(6,7)]}


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
//
// 	act(ship: string) {
// 		//console.log(ship, '---SHIP')
// 		const size = ShipsSizes[ship as keyof typeof ShipsSizes]
// 		//	console.log(size, 'SIZE')
// 		this.randomPoint(ship, size)
// 	}
//
// 	findEmpty(x: number, y: number,size:number, randomRotate:boolean,koef:number=0) {
// 		console.log("FINDEMPTY")
// 		const emptyNeigh:{x:number,y:number}[]=[]
// 		this.circleSteps.forEach(step => {
// 			const newY=step.y*(Math.abs(step.y)+koef)
// 			const newX=step.x*(Math.abs(step.x)+koef)
// 			if(y + newY>=this.boardMatrix.length || x + newX>=this.boardMatrix.length || x + newX<0 ||y + newY <0)return
// 			if(this.boardMatrix[y + newY][x + newX]===99){
// 				//	this.boardMatrix[y + step.y][x + step.x]=8
// 				emptyNeigh.push({x:x + newY,y:y + newX})
// 				// if(this.checkNeighbors(x + step.x,y + step.y, size, randomRotate)){
// 				// 	this.placeForShip(this.activeShip,x + step.x,y + step.y, randomRotate)
// 				// }
// 				//	else{
// 				//this.boardMatrix[y+step.y][x+step.x]=8
// 				//	this.findEmpty(x+step.x,y+step.y,size,randomRotate)
// 				//	}
// 			}
// 			//	console.log('!!!!', this.boardMatrix[y + step.y][x + step.x])
// 		})
// 		console.log(emptyNeigh,'#')
// 		return emptyNeigh
// 	}
//
// 	randomPoint(ship: string, size: number) {
// 		const randomRotate = !!Math.round(Math.random())
// 		const randomPointX = Math.floor(Math.random() * (this.boardMatrix.length - (!randomRotate ? size : 0)));
// 		const randomPointY = Math.floor(Math.random() * (this.boardMatrix.length - (randomRotate ? size : 0)));
// 		console.log(randomPointX, randomPointY, "x-y")
// 		console.log('ISROTATE', randomRotate)
// 		const isEmptyCell = this.boardMatrix[randomPointY][randomPointX]
// 		if (isEmptyCell === 99) {
// 			console.log("EMPTY")
// 			if (this.checkNeighbors(randomPointX, randomPointY, size, randomRotate)) {
// 				this.placeForShip(ship,randomPointX,randomPointY,randomRotate)
// 			} else {
// 				console.log("FIRST  ELSE")
// 				//this.randomPoint(ship, size)
// 				let koef=0
// 				const emptNei=this.findEmpty(randomPointX, randomPointY,size, randomRotate,0)
// 				console.log("EMPTneig",emptNei)
// 				if(emptNei.length) {
// 					emptNei.forEach(n => this.findEmpty(n.x, n.y, size, randomRotate))
// 				}else{
// 					console.log("SEC  ELSE")
// 					koef+=1
// 					const emptNei=this.findEmpty(randomPointX, randomPointY,size, randomRotate,koef)
// 					console.log("EMP========",emptNei)
// 				}
// 			}
// 		} else {
//
// 			console.log("THREE  ELSE")
// 			let koef=0
// 			const emptNei=this.findEmpty(randomPointX, randomPointY,size, randomRotate,0)
// 			console.log("EMPTneig",emptNei)
// 			if(emptNei.length) {
// 				emptNei.forEach(n => this.findEmpty(n.x, n.y, size, randomRotate))
// 			}else{
// 				if(koef+1>=this.boardMatrix.length)return
// 				koef+=1
// 				const emptNei=this.findEmpty(randomPointX, randomPointY,size, randomRotate,koef)
// 				console.log("EMP========",emptNei)
// 			}
// 			// const emptNei=this.findEmpty(randomPointX, randomPointY,size, randomRotate)
// 			// console.log("EMPTneig---else",emptNei)
// 			// emptNei.forEach(n=>this.findEmpty(n.x, n.y,size, randomRotate))
// 			console.log(this.boardMatrix)
// 			//	this.randomPoint(ship, size)
// 		}
// 	}
// 	placeForShip(ship:string,randomPointX:number,randomPointY:number,randomRotate:boolean){
// 		this.activeShip = ship
// 		this.prevPosX = randomPointX
// 		this.prevPosY = randomPointY
// 		this.isReversed = randomRotate
// 		//console.log("THISDATATODRAW")
// 		//	console.log(this.activeShip, this.prevPosX, this.prevPosY, this.isReversed, '-------')
// 		this.createShipImage()
// 	}
// 	onAutoShips(ships: Record<string, number>) {
// 		//rotate random
// 		//findRamdom point
// 		//if 5 => find closest empty cells
// 		//wave looking ->
// 		// if find empty->check
// 		// ->if rotate->checkvervic and horiz
// 		//if NO-> continue find
// 		//if YES-> addShip
// 		this.ships = JSON.parse(JSON.stringify(ships))
// 		//console.log(this.ships)
// 		const g=this.genShipsToAuto()
// 		let v=null
// 		//do{
// //todo clearinterval
// 		setInterval(()=>{
// 			v = g.next().value
// 			if(!v)return
// 			this.act(v as string)
// 		},100)
// 		//}while (v)
// 		// Object.entries(this.ships).forEach(e => {
// 		// 	console.log(e)
// 		// 	this.act(e[0])
// 		// })
// 	}

	// checkNeighbors(x: number, y: number, size: number, isRotate: boolean) {
	// 	const isEmpty = []
	// 	for (let i = 0; i < size; i++) {
	// 		const isIn = !isRotate
	// 			? (this.isInMatrix(y) && this.isInMatrix(x + i))
	// 			: (this.isInMatrix(y + i) && this.isInMatrix(x))
	// 		isEmpty.push(isIn &&
	// 			(!isRotate ? (this.boardMatrix[y][x + i] !== 5) : this.boardMatrix[y + i][x] !== 5))
	// 		console.log(!isRotate ? `${y}==${x + i}--->>>${this.boardMatrix[y][x+i]}`
	// 			: `${y+i}==${x}---->>>${this.boardMatrix[y+i][x]}`)
	// 	}
	//
	// 	console.log(isEmpty,'ISemp')
	// 	return isEmpty.every(e => e)
	// }

	occupateCells(areaCells: Set<string>) {
		   console.log(areaCells,'@@')
		this.emptyAreas.occupateArea(areaCells)
	}
}