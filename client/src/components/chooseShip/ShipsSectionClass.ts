import Control from "../../../common/controll";
import {ShipsCount, ShipsSizes} from "./ChooseComponent";

// export class ShipsSection extends Control {
// 	private shipsCountBlock: { type:string,count:number }[];
// 	public ships: Record<string, number>
// 	onAddShip:(shipType:string)=>void
// 	constructor(parentNode: HTMLElement,ships:Record<string, number>) {
// 		super(parentNode);
// 		this.shipsCountBlock = []
// 		this.ships = ships
// 		console.log(this.ships,'--------%%%%')
// 		Object.entries(this.ships).forEach((ship:[string,number],i) => {
// 			//const size=ShipsSizes[ship[0] as keyof typeof ShipsSizes]
//
// 			const size=ship[1]
// 			console.log(size,'SZZ')
// 			const shipItem = new Control(this.node, 'div')
// 			shipItem.node.style.width=`${50*size}px`
// 			const image = new Image()
// 			image.src = `./public/assets/ship.png`;
// 			image.style.width = '60%'
// 			image.style.height = '60%'
// 			image.onclick = (e) => {
// 				const shp=this.shipsCountBlock.find(sh=>sh.type===ship[0])
// 				if(shp.count==0)return
// 					shp.count-=1
// 				this.onAddShip(ship[0])
// 			}
// 			shipItem.node.appendChild(image)
// //todo add button rundom ships
// 			console.log("SHIPSSection")
// 			const shipCount = new Control(this.node, 'span', '', ''+ship[1])
// 			this.shipsCountBlock.push({
// 				type: ship[0],
// 				count: ship[1]
// 			})
// 		})
// 	}
// }