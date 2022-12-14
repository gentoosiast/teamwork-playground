import React, {useEffect, useRef, useState} from "react";
import {ShipsSection} from "./ShipsSection";

const ChooseComponent = () => {
	const canvasRef = useRef(null)
	const shipsRef = useRef(null)
	useEffect(() => {

		const shipsSection = new ShipsSection(shipsRef.current)
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



