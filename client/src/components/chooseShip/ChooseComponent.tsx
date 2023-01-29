import React, {useEffect, useRef, useState} from "react";
//import {ShipsSection} from "./ShipsSection";
import ShipsSection from "./ShipsSection";
import {useDispatch, useSelector} from "react-redux";
import {IShipsStore} from "../../reducer/shipsReducer";
import {CanvasComponent} from "./CanvasComponent";
import {setAutoPut} from '../../reducer/shipsReducer'
import {imagesObjType} from "../application/app";
import {AppDispatch, tShipCanvas} from "../../dto";
import SubTitle from "../styledComponents/subTitle";
import {backGroundColor, generalColor} from '../../styleConst'
import styled from "styled-components";
import Wrapper from "../styledComponents/wrapper";
import {ButtonRooms} from '../styledComponents/buttons'
import Content from "../styledComponents/content";
import {SpriteCanvas} from "../gameField/SpriteCanvas";

const ChooseComponent = ({imagesObj, onStartGame}
													 : { imagesObj: imagesObjType, onStartGame: (ship: tShipCanvas[]) => void }) => {
	const shipsRef = useRef(null)
	const dispatch = useDispatch<AppDispatch>()

	return (
		<Wrapper>
			<Content width={500}>
				<div ref={shipsRef}>
					<SubTitle>Arrange your ships on grid</SubTitle>
					<ShipsSection onStartGame={(ships: tShipCanvas[]) => {
						setTimeout(() => onStartGame(ships), 2000)
					}}/>
					<ButtonRooms onClick={() => dispatch(setAutoPut())}>Automatically</ButtonRooms>
				</div>
			</Content>
			<div>
				<CanvasComponent imagesObj={imagesObj}/>
			</div>
		</Wrapper>

	)
}
export default ChooseComponent



