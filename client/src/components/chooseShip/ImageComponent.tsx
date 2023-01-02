import Control from "../../../common/controll";
import React from "react";

const ImageComponent=({size,onClick}:{size:number,onClick:()=>void})=>{
	const src=`./public/assets/ship.png`
	const width=30
	const height='60%'

	return(
		<img
			src={src}
			alt="ship"
			style={{width:`${30*size}px`}}
			onClick={onClick}
		/>
	)
}
export default ImageComponent
// export default class ImageComponent extends Control{
// 	constructor(parent:HTMLElement) {
// 		super(parent);
// 		const image = new Image()
// 		image.src = `./public/assets/ship.png`;
// 		image.style.width = '60%'
// 		image.style.height = '60%'
// 		image.onclick = (e) => {
// 			// const shp = this.shipsCountBlock.find(sh => sh.type === ship[0])
// 			// if (shp.count == 0) return
// 			// shp.count -= 1
// 			// this.onAddShip(ship[0])
// 		}
// 		parent.appendChild(image)
// 	}
// }