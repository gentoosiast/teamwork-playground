

import { configureStore } from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pages from '../reducer/pagesReduser';
import roomsData from '../reducer/roomsReducer';
import fieldsData from '../reducer/fieldsReducer';

const store = configureStore({
  reducer: {  userData,pages,roomsData,fieldsData }
});
export default store;