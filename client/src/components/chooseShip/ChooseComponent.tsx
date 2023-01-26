import React, {useEffect, useRef, useState} from "react";
//import {ShipsSection} from "./ShipsSection";
import ShipsSection from "./ShipsSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {CanvasComponent} from "./CanvasComponent";
import {setAutoPut} from '../../reducer/shipsReducer'
import {imagesObjType} from "../application/app";
import {AppDispatch,tShipCanvas} from "../../dto";


const ChooseComponent = ({imagesObj,onStartGame}
:{imagesObj:imagesObjType,onStartGame:(ship:tShipCanvas[])=>void}) => {
	const shipsRef = useRef(null)
	const dispatch=useDispatch<AppDispatch>()

	return (
		<>
			<div ref={shipsRef}>
				<h5>Расставьте корабли</h5>
				<button onClick={()=>dispatch(setAutoPut())}>Расставить автоматически</button>
				<ShipsSection onStartGame={(ships:tShipCanvas[])=> {
					setTimeout(()=>onStartGame(ships),2000)
				}}/>
			</div>
			<CanvasComponent imagesObj={imagesObj}/>
		</>

	)
}
export default ChooseComponent



