import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  page: 'reg'
};

interface IPage {
    page: string
}

const pageReducer = createSlice({
  name: "pagesData",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<IPage>) {
        state.page = action.payload.page;
    },
  },
});

const { actions, reducer } = pageReducer;

export const {changePage} = actions;

export default reducer;