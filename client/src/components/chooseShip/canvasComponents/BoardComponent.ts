import Control from "../../../../common/controll";
import {imagesObjType} from "../../application/app";
import {tShipCanvas} from "../../../dto";

export default class BoardComponent extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private cellSize: number;
	private imagesData: imagesObjType;

	constructor(parentNode: HTMLElement, rows: number, columns: number, cellSize: number, imagesData: imagesObjType) {
		super(parentNode);
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.ctx = this.canvasSection.node.getContext('2d')
		this.cellSize = cellSize
		this.canvasSection.node.width = columns * cellSize
		this.canvasSection.node.height = rows * cellSize
		this.imagesData = imagesData
	}
	get canvas() {
		return this.canvasSection.node
	}
	get context(){
		return this.ctx
	}

	inPixels(indx: number) {
		return indx * this.cellSize
	}
//export const enum Cell {
//     Empty = 0,
//     Unavailable = 1,
//     Occupied = 2,
//     Shot = 3,
//     Killed = 4
//   }
	drawBoard(matrix: number[][]) {
		matrix.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				this.ctx.fillStyle =
					(cell === 5) ? "olive" :
						(cell === 1) ? 'darkGreen' :
						(cell === 2 ) ? 'blue' :
							(cell === 7 || cell===3) ? "red":
							(cell === 4 ) ? 'black' 
								: "green"
				this.ctx.fillRect((this.inPixels(cI)) + 1, (this.inPixels(rI)) + 1,
					this.cellSize - 2, this.cellSize - 2);
			})
		})
	}

	drawShips(shipsOnCanvas: tShipCanvas[]) {
		shipsOnCanvas?.forEach(ship => {
			const axis = ship.isRotate ? 'vertical' : 'horizont'
			const img = this.imagesData[axis][ship.type]
	
			this.ctx.drawImage(img, this.inPixels(ship.xC), this.inPixels(ship.yC),
				img.width, img.height)
		})
	}

	drawShotShips(matrix: number[][]){
		matrix.forEach((row, rI) => {
			row.forEach((cell, cI) => {
				if(cell===4||cell===3){
					const img = this.imagesData['vertical']['small'] ///!!!! тут маэ бути картинка з розбитим кореблем, я хз, як її добавити в загрузку картінок. типу фал fair 
					this.ctx.drawImage(img, this.inPixels(cI), this.inPixels(rI), img.width, img.height)
				}
			})
		})
	}

	drawScene(matrix: number[][], shipsOnCanvas?: tShipCanvas[]) {
		this.drawBoard(matrix)
		shipsOnCanvas && this.drawShips(shipsOnCanvas)
		this.drawShotShips(matrix)

	}
}
