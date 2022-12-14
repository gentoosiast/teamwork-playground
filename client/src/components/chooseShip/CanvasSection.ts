import Control from "../../../common/controll";
import {ShipsSizes} from "./ChooseComponent";

type tShipCanvas = { x: number, y: number, rotate: false, image: HTMLImageElement,  width:number,height:number }

export class CanvasSection extends Control {
	private canvasSection: Control<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private prevPosX: number;
	private prevPosY: number;
	private mouseDownHandlerBinded: () => void;
	private moveHandlerBinded: () => void;
	private parentNode: HTMLElement;
	private canvasWidth: number;
	private canvasHeight: number;
	public garlandCoordinates: { y: number; x: number[] }[];
	onDroppedShip: (toyIndex: string) => void
	private shipsOnCanvas: tShipCanvas[];

	constructor(parentNode: HTMLElement, ships: Record<string, number>) {
		super(parentNode);
		this.parentNode = parentNode
		this.canvasSection = new Control(parentNode, 'canvas', 'canvas')
		this.canvasSection.node.width = this.canvasWidth = 350
		this.canvasSection.node.height = this.canvasHeight = 500
		this.prevPosX
		this.prevPosX
		this.mouseDownHandlerBinded = this.mouseDownHandler.bind(this)
		this.moveHandlerBinded = this.moveHandler.bind(this)
		this.shipsOnCanvas = []
		this.canvasSection.node.addEventListener('mousedown', this.mouseDownHandlerBinded)
		this.ctx = this.canvasSection.node.getContext('2d')

		this.canvasSection.node.ondragover = (e) => {
			e.preventDefault()
		}
		this.canvasSection.node.ondrop = (e) => {
			const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
			const eventData = e.dataTransfer.getData('el')
			const shipWidth = ShipsSizes[eventData as keyof typeof ShipsSizes] * 15
			const shipHeight=ShipsSizes[eventData as keyof typeof ShipsSizes] * 5
			this.createImage('./public/assets/ship.png', shipWidth,shipHeight, (image) => {
				this.shipsOnCanvas.push({x, y, rotate: false, image, width:shipWidth,height:shipHeight})
				this.drawShip(image, x, y,  shipWidth,shipHeight)
			})
		}
		this.drawScene()
	}

	drawShip(image: HTMLImageElement, x: number, y: number, width:number,height:number) {
		this.ctx.drawImage(image, x, y, width,height)
	}

	mouseDownHandler(e: MouseEvent) {
		this.prevPosX = this.getCursorPosition(e, this.canvasSection.node).x
		this.prevPosY = this.getCursorPosition(e, this.canvasSection.node).y
		this.canvasSection.node.addEventListener('mousemove', this.moveHandlerBinded)
	}

	moveHandler(e: MouseEvent) {
		const {x, y} = this.getCursorPosition(e, this.canvasSection.node)
		//const currentShip = this.getCurrentShip(x, y)
		// this.prevPosX = x
		// this.prevPosY = y
		// this.drawScene()
		// this.canvasSection.node.onmouseup = (e) => {
		// 	//TODO даляются все одинаковые элементы
		// 	//попадают элнменты в диапозоне
		// 	this.canvasSection.node.removeEventListener('mousemove', this.moveHandlerBinded)
		// }
	}

	drawScene() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.ctx.fillStyle = 'orange'
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.shipsOnCanvas.forEach(ship => {
			this.ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height)
		})
	}

	// getCurrentShip(x: number, y: number): ToyImage {
	// 	// const { x, y } = this.getCursorPosition(e, this.node)
	// 	const current = this.treeOnCanvas.getCurrentToy(x, y)
	// 	return current[current.length - 1]
	// }

	public getCursorPosition(event: MouseEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		return {x, y}
	}

	createImage(url: string, width: number, height: number, callback: (img: HTMLImageElement) => void) {
		const image = new Image()
		image.src = url
		image.width = width
		image.height = height
		image.onload = () => {
			callback(image)
		}
	}
}

export default CanvasSection