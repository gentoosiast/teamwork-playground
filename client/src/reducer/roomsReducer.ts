import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoomsInitialState} from "../dto";

const initialState:IRoomsInitialState = {
   data:[
    // {
    //   roomId:5,
    //   roomUsers: [ {name: 'ddddd',
    //   index: 8}]
    // },
    // {
    //   roomId:5,
    //   roomUsers: [ {name: 'ddddd',
    //   index: 8}]
    // }, {
    //   roomId:5,
    //   roomUsers: [ {name: 'ddddd',
    //   index: 8}]
    // },
 
  ]
};

const roomsReducer = createSlice({
  name: "roomsData",
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<IRoomsInitialState>) {
        state.data = action.payload.data
    },
    
  },
});

const { actions, reducer } = roomsReducer;

export const {setRooms } = actions;

export default reducer;