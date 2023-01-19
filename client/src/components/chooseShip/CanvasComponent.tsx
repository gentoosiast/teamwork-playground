import React, {useEffect, useRef, useState} from "react";
import CanvasSection, {log, tShipCanvas} from "./CanvasSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {AppDispatch} from "../../dto";
import {addShip, setActiveShip, isRotateShip, setDecShip, randomRotate} from '../../reducer/shipsReducer'
import {fillCells, clearHovered, setMoveAdded, IBoardStore, fillAreaCells} from '../../reducer/boardReducer'
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
	const ships = useSelector((state: IShipsStore) => state.shipsData.shipsToPut)
	const board = useSelector((state: IBoardStore) => state.boardData.boardMatrix)

	useEffect(() => {
		if (!canvSection) {
			const canvas = new CanvasSection(canvasRef.current, ships, board, isRotated,
				activeShip, shipsOnCanvas, imagesObj, isAutoPut,
				(ship: tShipCanvas) => {
					dispatch(addShip({ship: JSON.stringify(ship), active: activeShip}))
					dispatch(setActiveShip(null))
					dispatch(setDecShip(ship.type))
				},
			)
			setCanvSection(canvas)
			canvas.shipsReady = () => {
				//	const shipsOnCanvasR = useSelector((state: IShipsStore) => state.shipsData.shipsOnCanvas)
				//	console.log(shipsOnCanvasR,'$$%$')

			}
			canvas.onRotateShip = () => dispatch(isRotateShip())
			canvas.onFillCells = (fillData) => dispatch(fillCells(fillData))
			canvas.onClearHovered = (value: number) => dispatch(clearHovered(value))
			canvas.onResetActiveShip = () => dispatch(setActiveShip(null))
			canvas.onFillShipArea = (areaCells, value) => {
				dispatch(fillAreaCells({data: Array.from(areaCells), value}))
			}
		} else {
			canvSection.destroy()
		}
	}, [])
	useEffect(() => canvSection?.autoPutShips(ships, board), [isAutoPut])
	useEffect(() => {
		canvSection?.updateShipOnBoard(shipsOnCanvas)
		//setSipsData(shipsOnCanvas)
		// shipsRef.current=shipsOnCanvas
		// console.log("SPcanvs",shipsOnCanvas)
		// console.log("REFFF",shipsRef.current)
	}, [shipsOnCanvas])
	useEffect(() => canvSection?.updateBoard(board), [board])
	useEffect(() => canvSection?.addActiveShip(activeShip), [activeShip])
	useEffect(() => canvSection?.setRotate(isRotated), [isRotated])
	return (
		<div ref={canvasRef}/>
	)
}