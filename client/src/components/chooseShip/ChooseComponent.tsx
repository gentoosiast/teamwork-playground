import React, {useEffect, useRef, useState} from "react";
import {ShipsSection} from "./ShipsSection";
import CanvasSection from "./CanvasSection";

export enum ShipsCount {
	huge=1,
	large,
	medium,
	small
}
export enum ShipsSizes{
	small=1,
	medium,
	large,
	huge
}

const ChooseComponent = () => {
	const [ships,setShips]=useState({
		huge: ShipsCount["huge"],
		large: ShipsCount["large"],
		medium: ShipsCount["medium"],
		small: ShipsCount["small"]
	})
	const canvasRef = useRef(null)
	const shipsRef = useRef(null)
	useEffect(() => {
		const shipsSection = new ShipsSection(shipsRef.current,ships)
		const canvasSection= new CanvasSection(shipsRef.current,ships)
	}, [])
	return (
		<>
			<div ref={shipsRef}>
				<h5>Расставьте корабли</h5>

			</div>
			<canvas ref={canvasRef}/>
		</>

	)
}
export default ChooseComponent



