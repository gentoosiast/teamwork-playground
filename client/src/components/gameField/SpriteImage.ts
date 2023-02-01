export default class SpriteImage {
	private img: HTMLImageElement;
	private curFrame: number;
	private totalFrames: number;
	private y: number;
	private x: number;
	private ctx: CanvasRenderingContext2D;
	private cellSize: number;

	constructor(y: number, x: number, ctx: CanvasRenderingContext2D, cellSize: number) {
		this.img = new Image();
		this.img.src = `./public/assets/explosion.png`;
		this.curFrame = 0
		this.cellSize = cellSize
		this.y = y
		this.x = x
		this.ctx = ctx
		this.totalFrames = 6
		this.img.onload = () => {
			this.draw(0)
		}
	}

	inPixels(coord: number) {
		return coord * this.cellSize
	}

	draw(frame:number) {

		this.ctx.clearRect(this.inPixels(this.x), this.inPixels(this.y),
			this.cellSize, this.cellSize)
		this.ctx.drawImage(this.img,
			this.img.width/6*frame, 0,
			this.img.width/6, this.img.height,
			this.inPixels(this.x)||0, this.inPixels(this.y)||0,
			this.cellSize, this.cellSize)//this.img.imgObj().width,this.img.imgObj().height);//frame size
		//this.incCurFrame()
const newFrame=frame+1<this.totalFrames?frame+1:0
	//	requestAnimationFrame(()=>this.draw(newFrame))
		setTimeout(()=>this.draw(newFrame),1000)
	}

	get imgObj() {
		return this.img
	}

	incCurFrame() {
		this.curFrame = (this.curFrame + 1) > this.totalFrames ? 0 : (this.curFrame + 1)
	}
}