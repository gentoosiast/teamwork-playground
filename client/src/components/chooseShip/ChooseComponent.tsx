import React, {useEffect, useRef, useState} from "react";
//import {ShipsSection} from "./ShipsSection";
import CanvasSection from "./CanvasSection";
import ShipsSection from "./ShipsSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {CanvasComponent} from "./CanvasComponent";
import {setAutoPut} from '../../reducer/shipsReducer'
import {imagesObjType} from "../application/app";
import {AppDispatch} from "../../dto";

export enum ShipsSizes {
	small = 1,
	medium,
	large,
	huge
}

const ChooseComponent = ({imagesObj}:{imagesObj:imagesObjType}) => {
	const shipsRef = useRef(null)
	const dispatch=useDispatch<AppDispatch>()

	return (
		<>
			<div ref={shipsRef}>
				<h5>Расставьте корабли</h5>
				<button onClick={()=>dispatch(setAutoPut())}>Расставить автоматически</button>
				<ShipsSection/>
			</div>
			<CanvasComponent imagesObj={imagesObj}/>
		</>

	)
}
export default ChooseComponent



