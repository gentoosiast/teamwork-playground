import React, {useEffect, useRef, useState} from "react";
import CanvasSection, {tShipCanvas} from "./CanvasSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {AppDispatch} from "../../dto";
import {addShip, setActiveShip, isRotateShip} from '../../reducer/shipsReducer'
import {imagesObjType} from "../application/app";

export const CanvasComponent = ({imagesObj}:{imagesObj:imagesObjType}) => {
	console.log("canvasCompImages",imagesObj)
	const canvasRef = useRef(null)
	const dispatch = useDispatch<AppDispatch>()
	const shipsOnCanvas = useSelector((state: IShipsStore) => state.shipsData.shipsOnCanvas)
	const isRotated = useSelector((state: IShipsStore) => state.shipsData.isRotate)
	const activeShip = useSelector((state: IShipsStore) => state.shipsData.activeShip)
	const isAutoPut = useSelector((state: IShipsStore) => state.shipsData.isAutoPut)

	//todo ask: AppDispatch whatFor
	const [canvSection, setCanvSection] = useState(null)
	const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
	type typeOnAddData = { type: string, ship: tShipCanvas }

	useEffect(() => {
		canvasRef.current.innerHTML = ''
		const canvas = new CanvasSection(canvasRef.current, ships, isRotated, activeShip, shipsOnCanvas, imagesObj,
			isAutoPut,
			(ship: tShipCanvas) => {
				dispatch(addShip({ship: JSON.stringify(ship), active: activeShip}))
			},
			(type: string, _isRotated: boolean) => {
				dispatch(setActiveShip(type))
				dispatch(isRotateShip(_isRotated))
			})
		setCanvSection(canvas)
	}, [activeShip, isAutoPut,shipsOnCanvas])

	return (
		<div ref={canvasRef}/>
	)
}