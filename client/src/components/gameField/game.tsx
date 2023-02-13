import './game.css';
import React, {useEffect, useRef, useState} from "react";
import {Cell, IFieldsInitialState, IUserInitialData, ITimer} from '../../dto'
import {SocketModel} from "../../socketModel";
import {useDispatch, useSelector} from 'react-redux';
import BoardComponent from "../chooseShip/canvasComponents/BoardComponent";
import {imagesObjType} from "../application/app";
import {IBoardStore} from "../../reducer/boardReducer";
import {BoardMatrixBase, BoardMatrixGameField} from "../chooseShip/canvasComponents/BoardMatrix";
import RandomShips from "../chooseShip/canvasComponents/RandomShips";
import {IShipsStore} from "../../reducer/shipsReducer";
import SubTitle from '../styledComponents/subTitle';
import Content from '../styledComponents/content'
import Wrapper from '../styledComponents/wrapper'
import {SpriteCanvas} from "./SpriteCanvas";
import {enemyOccupied,ourOccupied} from '../../reducer/boardReducer'
import TimerComponent from '../timer/timerComponent';
import { changeTimer } from '../../reducer/timerReducer';
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
	const oc= useSelector((state:IFieldStore)=>state.fieldsData.enemyOccupiedCell)
	const enemyField = useSelector((state: IFieldStore) => state.fieldsData.enemyField);
	const idGame = useSelector((state: IUserStore) => state.userData.idGames)
	const fieldRef = useRef(null)
	const cellInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize)
	const boardMatrix = new BoardMatrixGameField(enemyField)
	const dispatch= useDispatch()
	const [board, setBoard] = useState(null);
	useEffect(() => {
		board?.drawBoard(enemyField);
		board?.drawShotShips(enemyField)
		dispatch(enemyOccupied(oc))
	}, [enemyField])
	boardMatrix.onGetClickedCell = (x, y) => {
		props.socket.attack(x, y, idGame[idGame.length - 1]);
	}

	useEffect(() => {
		const Board = new BoardComponent(fieldRef.current, cellInRow, cellInRow, cellSize, props.shipsImages)
		//Board.canvas.addEventListener('click', (e) => boardMatrix.onClick(e, Board.canvas))
		Board.drawScene(enemyField)
		setBoard(Board)
	}, [])
	return (
		<div style={{position: 'relative'}}>
			<div ref={fieldRef}/>
			<SpriteCanvas	player="enemy" onClick={(cell)=>{
				boardMatrix.onClick(cell);
				dispatch(changeTimer({timer:false}))

			}}
			/>
		</div>
	)
}

export function OurField({shipsImages}: { shipsImages: imagesObjType }) {
	const oc= useSelector((state:IFieldStore)=>state.fieldsData.ourOccupiedCell)

	const ourField = useSelector((state: IFieldStore) => state.fieldsData.ourField);
	const ourRef = useRef(null)
	const cellInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize);
	const shipsOnCanvas = useSelector((state: IShipsStore) => state.shipsData.shipsOnCanvas)
	const [board, setBoard] = useState(null)
	const dispatch= useDispatch()

	useEffect(() => {
		//board?.drawBoard(ourField);
		board?.drawScene(ourField,shipsOnCanvas)
		dispatch(ourOccupied(oc))
	}, [ourField])
	useEffect(() => {
		const Board = new BoardComponent(ourRef.current, cellInRow, cellInRow, cellSize, shipsImages)
		Board.drawScene(ourField,shipsOnCanvas)
		setBoard(Board)
		//	const sprite=new SpriteCanvas(ourRef.current)
	}, [])

	return (
		<div style={{position: 'relative'}}>
			<div ref={ourRef}/>
			<SpriteCanvas	player="our"/>
				{/*//todo add 	<SpriteCanvas occupied={[]}/>*/}
		</div>

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

	const currentPlayer = useSelector((state: IUserStore) => state.userData.isCurrentPlayer);
	const idGame = useSelector((state: IUserStore) => state.userData.idGames);
	const timer = useSelector((state: ITimer)=>state.timerData.timer);
	const dispatch= useDispatch()
	return (
		<Wrapper>
			<Content width={310}>
				<SubTitle>{currentPlayer ? 'Your Turn' : 'Next player goes'}</SubTitle>
				<TimerComponent 
					count={5} 
					endTimer={()=>{
						dispatch(changeTimer({timer: false}))
						props.socket.randomAttack(idGame[idGame.length - 1])
					}} 
					startTimer={timer} />
			</Content>

			<>
				<OurField shipsImages={props.shipsImages}/>
				<EnemyField shipsImages={props.shipsImages} socket={props.socket}/>
			</>

		</Wrapper>
	);
}