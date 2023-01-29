import Control from "../../../common/controll";
import {SpriteBoardMatrix} from "../chooseShip/canvasComponents/BoardMatrix";

export class SpriteCanvasComponent extends Control<HTMLCanvasElement>{
	//private canvas: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private spriteMatrix: SpriteBoardMatrix;
	private board: [][];
	onClickSprite:(cell:{x:number,y:number})=>void
	constructor(parent:HTMLElement,width:number,height:number) {
		super(parent,'canvas');
		this.node.width=width
		this.node.height=height
		this.ctx= this.node.getContext('2d')
		this.board=new Array(10).fill(new Array(10).fill(0))
		this.spriteMatrix=new SpriteBoardMatrix(this.board,this.ctx)
		this.node.onclick=(e)=>	this.onClickSprite(this.spriteMatrix.getCursorPosition(e,this.node))
	}
}