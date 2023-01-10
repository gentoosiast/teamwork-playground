import * as React from "react";
import {useEffect} from "react";
import ImageComponent from "./ImageComponent";
import {ShipsSizes} from "./ChooseComponent";

const ShipsSection = ({ships, onAddActiveShip}:
												{ ships: Record<string, number>, onAddActiveShip: (type: string) => void }) => {
	return (
		<div>
			{
				Object.entries(ships).map((ship: [string, number], i) => {
					return (
						<p>
							<span>{ship[1]}</span>
							<ImageComponent
								onClick={() => ship[1] > 0 && onAddActiveShip(ship[0])}
								size={ShipsSizes[ship[0] as keyof typeof ShipsSizes]}/>
						</p>)
				})
			}
		</div>
	)
}
export default ShipsSection