import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWinnersState} from "../dto";

const initialState:IWinnersState = {
    winners:[{name: 'admin', wins:3},{name: 'admin', wins:3},{name: 'admin', wins:3},{name: 'admin', wins:3},{name: 'admin', wins:3}]
}

const winnersReducer = createSlice({
  name: "winnerData",
  initialState,
  reducers: {
    setWinners(state, action: PayloadAction<IWinnersState>) {
        state.winners = action.payload.winners;
    },
    
  },
});

const { actions, reducer } = winnersReducer;

export const {setWinners } = actions;

export default reducer;