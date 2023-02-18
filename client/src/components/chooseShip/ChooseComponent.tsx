import React, {useEffect, useRef, useState} from "react";
//import {ShipsSection} from "./ShipsSection";
import ShipsSection from "./ShipsSection";
import {useDispatch, useSelector} from "react-redux";
import {CanvasComponent} from "./CanvasComponent";
import {setAutoPut,rotateInput} from '../../reducer/shipsReducer'
import {imagesObjType} from "../application/app";
import {AppDispatch, tShipCanvas} from "../../dto";
import SubTitle from "../styledComponents/subTitle";
import Wrapper from "../styledComponents/wrapper";
import {ButtonRooms} from '../styledComponents/buttons'
import Content from "../styledComponents/content";
import TimerComponent from '../timer/timerComponent';
import {ITimer} from '../../dto';
import {changeTimer} from "../../reducer/timerReducer";

const ChooseComponent = ({imagesObj, onStartGame}
													 : { imagesObj: imagesObjType, onStartGame: (ship: tShipCanvas[]) => void }) => {
	const shipsRef = useRef(null)
	const dispatch = useDispatch<AppDispatch>()
	const timer = useSelector((state: ITimer) => state.timerData.timer)
	useEffect(() => {
		dispatch(changeTimer({timer: true}))
	}, [])

	return (
		<Wrapper>
			<Content width={500}>
				<div ref={shipsRef}>
					<SubTitle>Arrange your ships on grid</SubTitle>
					<TimerComponent count={25} endTimer={() => {
						dispatch(setAutoPut());
					}}
													startTimer={timer}
					/>
					<ShipsSection onStartGame={(ships: tShipCanvas[]) => {
						setTimeout(() => onStartGame(ships), 2000)
					}}/>
					<label>
						Rotate
						<input type='checkbox' onChange={(e) => dispatch(rotateInput(e.target.checked))}/>
					</label>
					<ButtonRooms onClick={() => {
						dispatch(setAutoPut());
						dispatch(changeTimer({timer: false}))
					}}>Automatically</ButtonRooms>
				</div>
			</Content>
			<div>
				<CanvasComponent imagesObj={imagesObj}/>
			</div>
		</Wrapper>

	)
}
export default ChooseComponent



