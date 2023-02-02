import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    timer: false,
};

interface ITimer{
  timer: boolean
}

const timerReduser = createSlice({
  name: "timerData",
  initialState,
  reducers: {
    changeTimer(state, action: PayloadAction<ITimer>) {
        state.timer = action.payload.timer;
    }
  },
});

const { actions, reducer } = timerReduser;

export const {changeTimer } = actions;

export default reducer;