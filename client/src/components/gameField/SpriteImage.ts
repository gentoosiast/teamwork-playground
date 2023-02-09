import {TimeoutId} from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";

export default class SpriteImage {
	private img: HTMLImageElement;
	private curFrame: number;
	private totalFrames: number;
	private y: number;
	private x: number;
	private ctx: CanvasRenderingContext2D;
	private cellSize: number;

	constructor(y: number, x: number, ctx: CanvasRenderingContext2D, cellSize: number,status:string) {
		this.img = new Image();
		this.img.src = status==='miss'? `./public/assets/water2.png`:`./public/assets/explosion.png`;
		this.curFrame = 0
		this.cellSize = cellSize
		this.y = y
		this.x = x
		this.ctx = ctx
		this.totalFrames = 6
		this.img.onload = () => {
			this.drawLogic(0, this.totalFrames * 3)
		}
	}

	inPixels(coord: number) {
		return coord * this.cellSize
	}

	drawLogic(frame: number, frms: number) {
		let count = frame
		let frmsTotal = frms
		const intId = setInterval(() => {
			this.draw(count++)
			frmsTotal--
			if (frmsTotal == 0) clearInterval(intId)
		}, 200)
	}

	draw(frame: number) {
		this.ctx.clearRect(this.inPixels(this.x), this.inPixels(this.y),
			this.cellSize, this.cellSize)
		this.ctx.drawImage(this.img,
			this.img.width / 6 * frame, 0,
			this.img.width / 6, this.img.height,
			this.inPixels(this.x) || 0, this.inPixels(this.y) || 0,
			this.cellSize, this.cellSize)
	}

	get imgObj() {
		return this.img
	}

	incCurFrame() {
		this.curFrame = (this.curFrame + 1) > this.totalFrames ? 0 : (this.curFrame + 1)
	}
}