import React, {useEffect, useRef, useState} from "react";
import CanvasSection, {tShipCanvas} from "./CanvasSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {AppDispatch} from "../../dto";
import {addShip,setActiveShip,isRotateShip} from '../../reducer/shipsReducer'

export const CanvasComponent = () => {
	const canvasRef = useRef(null)
	const dispatch = useDispatch<AppDispatch>()
	const shipsOnCanvas= useSelector((state:IShipsStore) => state.shipsData.shipsOnCanvas)
	const isRotated= useSelector((state:IShipsStore) => state.shipsData.isRotate)
	const activeShip= useSelector((state:IShipsStore) => state.shipsData.activeShip)
	const isAutoPut=useSelector((state:IShipsStore) => state.shipsData.isAutoPut)


	//todo ask: AppDispatch whatFor
	const [canvSection, setCanvSection] = useState(null)
	const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
	type typeOnAddData = { type: string, ship: tShipCanvas }

	useEffect(() => {
		canvasRef.current.innerHTML=''
		const canvas = new CanvasSection(canvasRef.current, ships,isRotated,activeShip,shipsOnCanvas,
			isAutoPut,
			(ship: tShipCanvas) => {
		//	console.log("CKICK",ship)
				dispatch(addShip({ship:JSON.stringify(ship), active:activeShip}))
			},
			(type:string,_isRotated:boolean)=>{
			dispatch(setActiveShip(type))
				dispatch(isRotateShip(_isRotated))
			})
		setCanvSection(canvas)
	}, [activeShip,isAutoPut])

	return (
		<div ref={canvasRef}/>
	)
}