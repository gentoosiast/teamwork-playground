import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoomsInitialState} from "../dto";

const initialState:IRoomsInitialState = {
   data:[]
};

const userReduser = createSlice({
  name: "roomsData",
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<IRoomsInitialState>) {
        state.data = action.payload.data
    },
    
  },
});

const { actions, reducer } = userReduser;

export const {setRooms } = actions;

export default reducer;