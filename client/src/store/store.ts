import {configureStore} from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pagesData from '../reducer/pagesReduser';
import roomsData from '../reducer/roomsReducer';
import fieldsData from '../reducer/fieldsReducer';
import shipsData from '../reducer/shipsReducer';
import boardData from '../reducer/boardReducer'

const store = configureStore({
	reducer: {userData, pagesData, roomsData, fieldsData, shipsData, boardData}
});
export default store;