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
import BackGround from '../styledComponents/background';
import Setting  from '../setting/setting';
import Sound from '../../utils/sound';
interface IPage {
	pagesData: {
		page: string;
	}
}
export type imagesObjType = {
	vertical: Record<string, HTMLImageElement>,
	horizont: Record<string, HTMLImageElement>,
	fire:HTMLImageElement
}
export const App = () => {
	const [socket, setSocket] = useState<SocketModel>(null);
	const [content, setContent] = useState(null);
	const [imagesObj, setImagesObj] = useState<imagesObjType>(null)
	const dispatch = useDispatch<AppDispatch>();
	const page = useSelector((state: IPage) => state.pagesData.page);


	useEffect(() => {
		if (page === 'room') {
			setContent(<Room socket={socket}/>);
		}
		if (page === 'chooseShip') {
			setContent(<ChooseShip imagesObj={imagesObj} socket={socket}/>);
		}
		if (page === 'gameField') {
			setContent(<>
				<GameField socket={socket} shipsImages={imagesObj}></GameField>
			</>);
		}
		if (page === 'finishGame') {
			setContent(<FinishPage/>)
		}
	}, [page]);

	useEffect(() => {
		createImagesObject(30,{small: 30, medium: 60, large: 90, huge: 120},
			(imagesObj)=>{
			setImagesObj(imagesObj)
			const webSocket = new SocketModel({dispatch});
			setSocket(webSocket);
			setContent(<Registration socket={webSocket}/>);
			
			//setContent(<ChooseShip socket={socket} imagesObj={imagesObj}/>);
			//setContent(	<GameField socket={socket} shipsImages={imagesObj}></GameField>)
			return () => {
				webSocket.close();
			}
		})
			},[])

			return (
				<BackGround>
					{content}
					{/* <ChooseComponent/> */}
					<Setting/>
				</BackGround>
			);
		}
