import React, {useEffect, useRef, useState} from "react";
import {ShipsSection} from "./ShipsSection";
import CanvasSection from "./CanvasSection";

export enum ShipsCount {
	huge = 1,
	large,
	medium,
	small
}

export enum ShipsSizes {
	small = 2,
	medium,
	large,
	huge
}

//todo add the other color under dragged ship
//todo draw cells
//
const ChooseComponent = () => {
	const [ships, setShips] = useState({
		huge: ShipsCount["huge"],
		large: ShipsCount["large"],
		medium: ShipsCount["medium"],
		small: ShipsCount["small"]
	})
	const canvasRef = useRef(null)
	const shipsRef = useRef(null)
	const [canvSection, setCanvSection] = useState(null)
	const [activeShip, setActiveShip] = useState<string>(null)
	useEffect(() => {
		canvSection?.addActiveShip(activeShip)
	}, [activeShip])
	useEffect(() => {
		const shipsSection = new ShipsSection(shipsRef.current, ships)
		shipsSection.onAddShip = (shipType) => {
			setActiveShip(shipType)
		}
		setCanvSection(new CanvasSection(shipsRef.current, ships))
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



