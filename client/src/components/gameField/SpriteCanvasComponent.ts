import Control from "../../../common/controll";
import {SpriteBoardMatrix} from "../chooseShip/canvasComponents/BoardMatrix";
import SpriteImage from "./SpriteImage";

export class SpriteCanvasComponent extends Control<HTMLCanvasElement> {
	//private canvas: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private spriteMatrix: SpriteBoardMatrix;
	private board: [][];
	onClickSprite: (cell: { x: number, y: number }) => void
	private occupied: { x: number; y: number }[];
	private hashedCells: Map<string, SpriteImage>;

	constructor(parent: HTMLElement, width: number, height: number) {
		super(parent, 'canvas');
		this.node.width = width
		this.node.height = height
		this.hashedCells = new Map()
		this.ctx = this.node.getContext('2d')
		this.board = new Array(10).fill(new Array(10).fill(0))
		this.spriteMatrix = new SpriteBoardMatrix(this.board, this.ctx)
		this.node.onclick = (e) => this.onClickSprite(this.spriteMatrix.getCursorPosition(e, this.node))
	}

	upDateOccupied(occupied: { x: number, y: number }[]) {
		const apdtdSet = new Set()
		occupied.forEach(oc => apdtdSet.add(`${oc.y}-${oc.x}`))
		occupied.forEach(oc => {
			if (!this.hashedCells.has(`${oc.y}-${oc.x}`)) {
				this.hashedCells.set(`${oc.y}-${oc.x}`, new SpriteImage(+oc.y,+oc.x,this.ctx,this.spriteMatrix.cellSize))
			}
		})

		Array.from(this.hashedCells).forEach(c => {
			if (!apdtdSet.has(c[0])) {
				this.hashedCells.delete(c[0])
			}
		})

		this.drawOc()
	}

	drawOc() {
console.log("!!1")
		Array.from(this.hashedCells).forEach(c=>{
				console.log("CC",c)
				this.spriteMatrix?.drawExp(c[0],c[1])
		})
	}
}