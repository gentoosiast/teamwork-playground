import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  page: 'reg'
};

interface IPage {
    page: string
}

const pageReduser = createSlice({
  name: "pagesData",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<IPage>) {
        state.page = action.payload.page;
    },
  },
});

const { actions, reducer } = pageReduser;

export const {changePage} = actions;

export default reducer;