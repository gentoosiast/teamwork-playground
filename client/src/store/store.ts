

import { configureStore } from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
import pages from '../reducer/pagesReduser';
//import { typeDataForCanvasChart } from "../dto";

// export type stateType = {
//   userData: { email: string; name: string; password: string };
//   canvasDataChart: { data: typeDataForCanvasChart };
// };
const store = configureStore({
  reducer: { /*reduser*/ userData,pages },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;