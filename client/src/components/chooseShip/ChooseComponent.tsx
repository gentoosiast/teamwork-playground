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
	const canvasRef = useRef(null)
	const shipsRef = useRef(null)
	const ships = useRef({
		huge: ShipsCount["huge"],
		large: ShipsCount["large"],
		medium: ShipsCount["medium"],
		small: ShipsCount["small"]
	})
	const [canvSection, setCanvSection] = useState(null)
	const [activeShip, setActiveShip] = useState<string>(null)
	useEffect(() => {
		canvSection?.addActiveShip(activeShip)
		console.log("ACTIVESHIP", activeShip)
	}, [activeShip])
	useEffect(() => {
		const canvas = new CanvasSection(shipsRef.current, (ship) => {
			ships.current = {
				...ships.current, [ship]: (ships.current[ship as keyof typeof ships.current] - 1)
			}
			setActiveShip(activeShip)
		})
		setCanvSection(canvas)
	}, [])

	return (
		<>
			<div ref={shipsRef}>
				<h5>Расставьте корабли</h5>
				<ShipsSection ships={ships.current} onAddActiveShip={(type: string) => {
					if (type === activeShip) {
						setActiveShip('')
						setTimeout(() => setActiveShip(type), 0)
					} else {
						setActiveShip(type)
					}
				}}/>
			</div>
			<canvas ref={canvasRef}/>
		</>

	)
}
export default ChooseComponent



