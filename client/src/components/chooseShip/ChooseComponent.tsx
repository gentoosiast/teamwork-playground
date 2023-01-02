import React, {useEffect, useRef, useState} from "react";
//import {ShipsSection} from "./ShipsSection";
import CanvasSection from "./CanvasSection";
import ShipsSection from "./ShipsSection";

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
		const canvas = new CanvasSection(shipsRef.current, (ship) => {
			setShips({...ships, [ship]: ships[ship as keyof typeof ships] - 1})
			setActiveShip(null)
		})
		setCanvSection(canvas)
	}, [])
	return (
		<>
			<div ref={shipsRef}>
				<h5>Расставьте корабли</h5>
				<ShipsSection ships={ships} onAddActiveShip={(type: string) => {
					setActiveShip(type)
				}}/>
			</div>
			<canvas ref={canvasRef}/>
		</>

	)
}
export default ChooseComponent



