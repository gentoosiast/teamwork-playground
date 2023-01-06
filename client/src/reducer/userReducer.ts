import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser ,IUserInitialData} from "../dto";


const initialState:IUserInitialData = {
  data: {
    name: '',
    index: -1,
    currentPlayer: false,
    winner: -1,
  },
};

///const dispatch = useDispatch<AppDispatch>();
interface IUserEmail {
  email: string;
}



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
interface IUserData {
    name: string,
    index: number,
}

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

const userReduser = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addUserData(state, action: PayloadAction<IUser>) {
        state.data.name = action.payload.name;
        state.data.index = action.payload.index;
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

const { actions, reducer } = userReduser;

export const {addUserData } = actions;

export default reducer;