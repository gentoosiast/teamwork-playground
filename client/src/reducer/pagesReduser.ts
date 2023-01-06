import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserInitialData} from "../dto";


const initialState = {
  page: 'reg'
};

///const dispatch = useDispatch<AppDispatch>();



// export const changeHabbitsName = createAsyncThunk(
//   "changeHabbitsName",
//   async ({ idHabbit, value }: INameChange, thunkAPI) => {
//     const response = await requestHabbitsChange({ idHabbit, value });
//     if (response.status === "ok") {
//       return {
//         data: response.data,
//       };
//     }
//     throw new Error("false data");
//   }
// );


// export const changeHabbitsInput = createAsyncThunk(
//   "changeHabbitsInput",
//   async ({ idHabbit, idEl, value }: IInputChange, thunkAPI) => {
//     const response = await requestHabbitsChangeInput({ idHabbit, idEl, value });
//     if (response.status === "ok") {
//       return {
//         data: response.data,
//       };
//     }
//     throw new Error("false data");
//   }
// );
//addNewHabbit
interface IPage {
    page: string
}

const pageReduser = createSlice({
  name: "pages",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<IPage>) {
        state.page = action.payload.page;
    },
    },
    // builder.addCase(changeHabbitsInput.fulfilled, (state, action) => {
    //   state.data = action.payload.data;
    // }),
    //   builder.addCase(changeHabbitsInput.rejected, (state, action) => {
    //     console.log("err");
    //   });
    // builder.addCase(addNewHabbit.fulfilled, (state, action) => {
    //   state.data = action.payload.data;
    // }),
    //   builder.addCase(addNewHabbit.rejected, (state, action) => {
    //     console.log("err");
    //   });
});

const { actions, reducer } = pageReduser;

export const {changePage} = actions;

export default reducer;