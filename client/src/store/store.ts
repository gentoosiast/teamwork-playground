

import { configureStore } from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pagesData from '../reducer/pagesReduser';
import roomsData from '../reducer/roomsReducer';
import fieldsData from '../reducer/fieldsReducer';
import shipsData from '../reducer/shipsReducer';

const store = configureStore({
  reducer: {  userData,pagesData,roomsData,fieldsData,shipsData}
});
export default store;