import React, {useEffect, useState} from "react";
import {GameField} from '../gameField/game';
import Registration from '../registration/registration';
import {SocketModel} from "../../socketModel";
import {AppDispatch} from '../../dto'
import Room from '../room/room';
import FinishPage from '../finishPage/finishPage';
import ChooseShip from '../chooseShip/chooseShip';
import {useDispatch, useSelector} from "react-redux";
import imageObj from "../../utils/Image";
import {createImagesObject} from "../../utils/functions";

interface IPage {
	pagesData: {
		page: string;
	}
}

export type imagesObjType = {
	vertical: Record<string, HTMLImageElement>,
	horizont: Record<string, HTMLImageElement>
}
export const App = () => {
	const [socket, setSocket] = useState<SocketModel>(null);
	const [content, setContent] = useState(null);
	const [imagesObj, setImagesObj] = useState<imagesObjType>(null)
	const dispatch = useDispatch<AppDispatch>();
	const page = useSelector((state: IPage) => state.pagesData.page);

	useEffect(() => {
	//	console.log("PAGEuseEff")
		if (page === 'room') {
			setContent(<Room socket={socket}/>);
		}
		if (page === 'chooseShip') {
			setContent(<ChooseShip imagesObj={imagesObj} socket={socket}/>);
		}
		if (page === 'gameField') {
			setContent(<>
				<GameField socket={socket}></GameField>
			</>);
		}
		if (page === 'finishGame') {
			setContent(<FinishPage/>)
		}
	}, [page]);

	useEffect(() => {
		//console.log("CreateuseEff")
		createImagesObject(30,{small: 60, medium: 90, large: 120, huge: 150},(imagesObj)=>{
			setImagesObj(imagesObj)
			const webSocket = new SocketModel({dispatch});
			setSocket(webSocket);
			// setContent(<Registration socket={webSocket}/>);
			setContent(<ChooseShip socket={socket} imagesObj={imagesObj}/>);
			return () => {
				webSocket.close();
			}
		})
			},[])

			return (
				<>
					{content}
					{/* <ChooseComponent/> */}
				</>
			);
		}