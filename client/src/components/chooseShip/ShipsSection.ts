import Control from "../../../common/controll";
import {ShipsCount, ShipsSizes} from "./ChooseComponent";

export class ShipsSection extends Control {

	private shipsCountBlock: { type:string,count:number }[];
	public ships: Record<string, number>

	constructor(parentNode: HTMLElement,ships:Record<string, number>) {
		super(parentNode);
		this.shipsCountBlock = []
		this.ships = ships
		console.log(ships)
		Object.entries(this.ships).forEach((ship:[string,number],i) => {
			console.log(ShipsSizes[ship[0] as keyof typeof ShipsSizes])
			const size=ShipsSizes[ship[0] as keyof typeof ShipsSizes]
			const shipItem = new Control(this.node, 'div')
			shipItem.node.style.width=`${50*size}px`
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