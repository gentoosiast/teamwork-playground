

import { configureStore } from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pages from '../reducer/pagesReduser';
import roomsData from '../reducer/roomsReducer'

const store = configureStore({
  reducer: {  userData,pages,roomsData }
});
export default store;