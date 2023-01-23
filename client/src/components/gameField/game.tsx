import './game.css';
import React, {useEffect, useRef, useState} from "react";
import {Cell, IFieldsInitialState, IUserInitialData,tShipCanvas} from '../../dto'
import {SocketModel} from "../../socketModel";
import {useSelector} from 'react-redux';
import BoardComponent from "../chooseShip/canvasComponents/BoardComponent";
import {imagesObjType} from "../application/app";
import {IBoardStore} from "../../reducer/boardReducer";
import {BoardMatrixBase, BoardMatrixGameField} from "../chooseShip/canvasComponents/BoardMatrix";

const styleMap = {
	[Cell.Empty]: '',
	[Cell.Occupied]: 'cell_occupied',
	[Cell.Unavailable]: 'cell_unavailable',
	[Cell.Shot]: 'cell_shot',
	[Cell.Killed]: 'cell_killed'
};

interface IGameFieldProps {
	socket: SocketModel;
	shipsImages: imagesObjType
}

interface IFieldStore {
	fieldsData: IFieldsInitialState;
}

export function EnemyField(props: IGameFieldProps) {
	const enemyField = useSelector((state: IFieldStore) => state.fieldsData.enemyField);
	const idGame = useSelector((state: IUserStore) => state.userData.idGames)
	const fieldRef = useRef(null)
	const cellInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize)
	const boardMatrix= new BoardMatrixGameField(enemyField)
	boardMatrix.onGetClickedCell=(x,y)=>{
		console.log(x,y)
		props.socket.attack(x, y, idGame[idGame.length-1]);
	}
	{/*//       <div className={"cell" + (` ${styleMap[cell]}`)} key={x} onClick={() => */}
	{/*//         props.socket.attack(x, y, idGame[idGame.length-1]);*/}
	useEffect(() => {
		const Board = new BoardComponent(fieldRef.current,cellInRow,cellInRow,cellSize,props.shipsImages)
		Board.canvas.addEventListener('click',(e)=>boardMatrix.onClick(e,Board.canvas))
		Board.drawScene(enemyField)
	}, [])
	return (
					<div ref={fieldRef}/>
	)
}

export function OurField({shipsImages}:{shipsImages:imagesObjType}) {
	const ourField = useSelector((state: IFieldStore) => state.fieldsData.ourField);
	const ourRef= useRef(null)
	const cellInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize)
	useEffect(() => {
		const Board = new BoardComponent(ourRef.current,cellInRow,cellInRow,cellSize,shipsImages)
		Board.drawScene(ourField)
	}, [])
	return (
	<div ref={ourRef}/>
	);	// <div className="field">
	// 	{ourField.map((row, i) => {
	// 		return (
	// 			<div className="row" key={i}>
	// 				{
	// 					row.map((cell, j) => {
	// 						return (
	// 							<div className={"cell" + (` ${styleMap[cell]}`)} key={j}></div>
	// 						)
	// 					})
	// 				}
	// 			</div>
	// 		);
	// 	})}
	// </div>
}

interface IUserStore {
	userData: IUserInitialData;
}

export function GameField(props: IGameFieldProps) {
	const currentPlayer = useSelector((state: IUserStore) => state.userData.isCurrentPlayer)
	return (
		<div>
			<p>{currentPlayer ? 'Your Turn' : 'Next player goes'}</p>
			<OurField shipsImages={props.shipsImages}/>
			<EnemyField shipsImages={props.shipsImages} socket={props.socket}/>
		</div>
	);
}