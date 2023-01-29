// @ts-ignore
import React, {useEffect, useRef} from "react";
import {SpriteCanvasComponent} from "./SpriteCanvasComponent";
import {useSelector} from "react-redux";
import {IBoardStore} from "../../reducer/boardReducer";
import {BoardMatrixBase} from "../chooseShip/canvasComponents/BoardMatrix";

export const SpriteCanvas = () => {
	const spriteRef = useRef(null)
	const cellSize = useSelector((state: IBoardStore) => state.boardData.cellSize)
	const celsInRow = useSelector((state: IBoardStore) => state.boardData.cellsInRow)
	const boardMatrixBase=new BoardMatrixBase(new Array(10).fill(new Array(10).fill(0)))
	useEffect(() => {
		const sp = new SpriteCanvasComponent(spriteRef.current, cellSize * celsInRow, cellSize * celsInRow)
		sp.onClickSprite=(cell)=>console.log(cell)
	}, [])
	return (
		<div style={{position: 'absolute',top: '0'}}
				 ref={spriteRef}/>
	)
}