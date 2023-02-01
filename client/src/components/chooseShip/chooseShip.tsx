
import SubTitle from '../styledComponents/subTitle'
import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {IShip, IUserInitialData, ShipsSizes,tShipCanvas} from '../../dto';
import Wrapper from '../styledComponents/wrapper'
import {SocketModel} from '../../socketModel';
import ChooseComponent from "./ChooseComponent";
import {IShipsStore} from "../../reducer/shipsReducer";
import {imagesObjType} from "../application/app";
import {SpriteCanvas} from "../gameField/SpriteCanvas";

interface IChooseShip {
	socket: SocketModel,
	imagesObj: imagesObjType
}

interface IUserStore {
	userData: IUserInitialData;
}

const ChooseShip = ({socket, imagesObj}: IChooseShip) => {
	const idGame = useSelector((state: IUserStore) => state.userData.idGames)
	const shipsOnCanvas= useSelector((state:IShipsStore)=>state.shipsData.shipsOnCanvas)
	return (<>
		<ChooseComponent imagesObj={imagesObj} onStartGame={()=>{
			const toIShip:IShip[]=shipsOnCanvas.map(sh=>{
				return {
					position:{x:sh.xC,y:sh.yC},
					direction:!!sh.isRotate,
					type:sh.type,
					length: ShipsSizes[sh.type]
				}
			})
			console.log('StartGame',toIShip )
			socket?.startGame(idGame[idGame.length - 1], toIShip)
			}}/>
	</>)
}

export default ChooseShip;