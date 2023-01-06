

import { configureStore } from "@reduxjs/toolkit";
import userData from '../reducer/userReducer';
//import { typeDataForCanvasChart } from "../dto";

// export type stateType = {
//   userData: { email: string; name: string; password: string };
//   canvasDataChart: { data: typeDataForCanvasChart };
// };
const store = configureStore({
  reducer: { /*reduser*/ userData },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;