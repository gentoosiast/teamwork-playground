import React, {useEffect, useRef, useState} from "react";
import CanvasSection, {tShipCanvas} from "./CanvasSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {AppDispatch} from "../../dto";
import {addShip, setActiveShip, isRotateShip} from '../../reducer/shipsReducer'
import {fillCells, clearHovered, setMoveAdded, IBoardStore} from '../../reducer/boardReducer'
import {imagesObjType} from "../application/app";

export const CanvasComponent = ({imagesObj}: { imagesObj: imagesObjType }) => {
	const canvasRef = useRef(null)
	const dispatch = useDispatch<AppDispatch>()
	const shipsOnCanvas = useSelector((state: IShipsStore) => state.shipsData.shipsOnCanvas)
	const isRotated = useSelector((state: IShipsStore) => state.shipsData.isRotate)
	const activeShip = useSelector((state: IShipsStore) => state.shipsData.activeShip)
	const isAutoPut = useSelector((state: IShipsStore) => state.shipsData.isAutoPut)

	//todo ask: AppDispatch whatFor
	const [canvSection, setCanvSection] = useState(null)
	const [isM, setIsM] = useState(false)
	const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
	type typeOnAddData = { type: string, ship: tShipCanvas }
	const board = useSelector((state: IBoardStore) => state.boardData.boardMatrix)

	useEffect(() => {
		//console.log("activeShip")
		if (!canvSection) {
			const canvas = new CanvasSection(canvasRef.current, ships, board, isRotated, activeShip, shipsOnCanvas, imagesObj,
				isAutoPut,
				(ship: tShipCanvas) => {
					dispatch(addShip({ship: JSON.stringify(ship), active: activeShip}))
					dispatch(setActiveShip(null))
				},
				(type: string, _isRotated: boolean) => {
					//dispatch(setActiveShip(type))
					//other method from random=====>dispatch(isRotateShip(_isRotated))
				})
			setCanvSection(canvas)
			canvas.onRotateShip = () => {
				dispatch(isRotateShip())
			}
			canvas.onFillCells = (fillData) => {
				dispatch(fillCells(fillData))
			}
			canvas.onClearHovered = (value: number) => {
				dispatch(clearHovered(value))
			}
			canvas.onResetActiveShip=()=>	dispatch(setActiveShip(null))
		} else {
			canvSection.destroy()
		}
	}, [isAutoPut, isM])

	useEffect(() => canvSection?.updateShipOnBoard(shipsOnCanvas), [shipsOnCanvas])
	useEffect(() => canvSection?.updateBoard(board), [board])
	useEffect(() => {
		canvSection?.addActiveShip(activeShip)
	}, [activeShip])

	useEffect(() => {
		console.log("ROTATE")
		canvSection?.setRotate(isRotated)
	}, [isRotated])
	return (
		<div ref={canvasRef}/>
	)
}