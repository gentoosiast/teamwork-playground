import * as React from "react";
import ImageComponent from "./ImageComponent";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {setActiveShip} from '../../reducer/shipsReducer'
import {ShipsSizes} from "./ChooseComponent";
import acorn from "acorn";

const ShipsSection = () => {
	const ships=useSelector(((state:IShipsStore) => state.shipsData.shipsToPut))
	//console.log(ships,'SPS')
	const dispatch=useDispatch()
	return (
		<div>
			{
				Object.entries(ships).map((ship: [string, number], i) => {
					console.log(ship)
					return (
						<p>
							<span>{ship[1]}</span>
							<ImageComponent
								onClick={() => {
									dispatch(setActiveShip(ship[0]))
								}
								}
								size={ShipsSizes[ship[0] as keyof typeof ShipsSizes]}/>
						</p>)
				})
			}
		</div>
	)
}
export default ShipsSection