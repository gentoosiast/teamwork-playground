import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {IUserInitialData} from '../../dto';

import {SocketModel} from '../../socketModel';
import ChooseComponent from "./ChooseComponent";
import {IShipsStore} from "../../reducer/shipsReducer";
import {imagesObjType} from "../application/app";

interface IChooseShip {
	socket: SocketModel,
	imagesObj: imagesObjType
}

const ships = [[
	{
		position: {x: 0, y: 2},
		direction: 0,
		length: 4
	},
	{
		position: {x: 2, y: 4},
		direction: 1,
		length: 4
	},
	{
		position: {x: 7, y: 7},
		direction: 0,
		length: 1
	}
], [
	{
		position: {x: 3, y: 3},
		direction: 1,
		length: 3
	},
	{
		position: {x: 1, y: 1},
		direction: 1,
		length: 2
	},
	{
		position: {x: 4, y: 8},
		direction: 0,
		length: 1
	}
], [{
	position: {x: 3, y: 2},
	direction: 1,
	length: 3
}, {
	position: {x: 4, y: 6},
	direction: 1,
	length: 2
}, {
	position: {x: 1, y: 1},
	direction: 0,
	length: 1
}], [
	{
		position: {x: 4, y: 5},
		direction: 1,
		length: 3
	},
	{
		position: {x: 0, y: 0},
		direction: 1,
		length: 2
	},
	{
		position: {x: 8, y: 8},
		direction: 0,
		length: 1
	}
]];

interface IUserStore {
	userData: IUserInitialData;
}

const ChooseShip = ({socket, imagesObj}: IChooseShip) => {
	const rand = 0//Math.floor(Math.random()*3)
	const idGame = useSelector((state: IUserStore) => state.userData.idGames)
	const shipsw = useSelector(((state: IShipsStore) => state.shipsData.shipsToPut))

	console.log('!!!!!------',imagesObj)
	return (<>
		<ChooseComponent imagesObj={imagesObj}/>
		<button onClick={() => socket.startGame(idGame[idGame.length - 1], ships[rand])}>Start game</button>
	</>)
}

export default ChooseShip;