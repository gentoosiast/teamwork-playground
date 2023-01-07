import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserInitialData} from "../dto";


const initialState:IUserInitialData = {
  data: {
    name: '',
    index: -1,
    isCurrentPlayer: false,
    winner: -1,
    idGames: []
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
interface IUserName{
  name: string
}
interface IUserIndex{
  index: number
}
interface IIdGame {
  idGame: number
}
interface ICurrentPlayer{
  isCurrentPlayer: boolean
}

const userReduser = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addUserName(state, action: PayloadAction<IUserName>) {
        state.data.name = action.payload.name;
    },
    addUserIndex(state, action: PayloadAction<IUserIndex>) {
      state.data.index = action.payload.index;
    },
    addIdGame(state, action: PayloadAction<IIdGame>) {
      state.data.idGames.push(action.payload.idGame);
    },
    changeCurrentPlayer(state, action: PayloadAction<ICurrentPlayer>){
      state.data.isCurrentPlayer=action.payload.isCurrentPlayer;
    }
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

export const {addUserName,addUserIndex,addIdGame,changeCurrentPlayer } = actions;

export default reducer;