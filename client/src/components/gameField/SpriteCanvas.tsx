// @ts-ignore
import React, {useEffect, useRef, useState} from "react";
import {SpriteCanvasComponent} from "./SpriteCanvasComponent";
import {useSelector} from "react-redux";
import {IBoardStore} from "../../reducer/boardReducer";
import {BoardMatrixBase} from "../chooseShip/canvasComponents/BoardMatrix";

export const SpriteCanvas = (props:{player:string,onClick?:(cell:{x:number,y:number})=>void}) => {
	const spriteRef = useRef(null)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize)
	const celsInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)

	const ourData=useSelector((state:IBoardStore) => state.boardData.ourOccupiedData)
	const enemyData=useSelector((state:IBoardStore) => state.boardData.enemyOccupiedData)
//porps.enemy
const data=props.player==='enemy'?enemyData:ourData
	useEffect(()=>{
		sprite?.upDateOccupied(data)
	},[data])

	const [sprite,setSprite]=useState(null)
	useEffect(() => {
		const sp = new SpriteCanvasComponent(spriteRef.current, cellSize * celsInRow, cellSize * celsInRow)
		sp.onClickSprite=(cell)=>props.onClick(cell)
		setSprite(sp)
	}, [])

	return (
		<div style={{position: 'absolute',top: '0'}}
				 ref={spriteRef}/>
	)
}