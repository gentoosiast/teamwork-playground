import {configureStore} from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pagesData from '../reducer/pagesReducer';
import roomsData from '../reducer/roomsReducer';
import fieldsData from '../reducer/fieldsReducer';
import shipsData from '../reducer/shipsReducer';
import boardData from '../reducer/boardReducer';
import timerData from '../reducer/timerReducer';
import winnerData from '../reducer/winnerReducer';

const store = configureStore({
	reducer: {userData, pagesData, roomsData, fieldsData, shipsData, boardData,timerData,winnerData}
});
export default store;