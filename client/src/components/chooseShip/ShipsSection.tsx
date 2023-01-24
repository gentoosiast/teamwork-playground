import * as React from "react";
import ImageComponent from "./ImageComponent";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {setActiveShip} from '../../reducer/shipsReducer'
import acorn from "acorn";
import {AppDispatch, ShipsSizes, tShipCanvas} from "../../dto";
import {useCallback} from "react";


const ShipsSection = ({onStartGame}
												: { onStartGame: (ships: tShipCanvas[]) => void }) => {
	const ships = useSelector(((state: IShipsStore) => state.shipsData.shipsToPut))
	const shipsOnCanvas = useSelector((state: IShipsStore) => state.shipsData.shipsOnCanvas)
	const isReady = useCallback(() => {
		return Object.values(ships).every(e => e === 0)
	}, [ships])
	if (isReady()) {
		//console.log(shipsOnCanvas,'^')
		onStartGame(shipsOnCanvas)
	}
	const dispatch = useDispatch<AppDispatch>()
	return (
		<div>
			{
				Object.entries(ships).map((ship: [string, number], i) => {
					return (
						<p key={i}>
							<span>{ship[1]}</span>
							<ImageComponent
								onClick={() => {
									if (ship[1] > 0) dispatch(setActiveShip(ship[0]))
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