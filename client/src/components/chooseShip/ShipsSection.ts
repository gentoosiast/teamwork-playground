import Control from "../../../common/controll";

export class ShipsSection extends Control {

	private shipsCountBlock: { type:string,count:number }[];
	public ships: Record<string, number>

	constructor(parentNode: HTMLElement) {
		super(parentNode);
		this.shipsCountBlock = []
		this.ships = {
			huge: 1,
			big: 2,
			middle: 3,
			small: 4
		}
		Object.entries(this.ships).forEach((ship,i) => {
			const shipItem = new Control(this.node, 'div')
			shipItem.node.style.width=`${50/(i+1)}px`
			const image = new Image()
			image.src = `./public/assets/ship.png`;
			image.style.width = '60%'
			image.style.height = '60%'
			image.draggable = true
			image.ondragstart = (e) => {
				e.dataTransfer.setData('el', ship[0])
			}
			shipItem.node.appendChild(image)

			const shipCount = new Control(this.node, 'span', '', ''+ship[1])
			this.shipsCountBlock.push({
				type: ship[0],
				count: ship[1]
			})
		})
	}
}