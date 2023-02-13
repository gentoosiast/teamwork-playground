import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserInitialData} from "../dto";

const initialState:IUserInitialData = {
    name: '',
    index: -1,
    isCurrentPlayer: false,
    winner: false,
    idGames: [],
    error: false,
    errorText: '',
};

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
interface IWinner{
  winner: boolean
}
interface IUserError{
  error: boolean,
  errorText: string
}

const userReduser = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addUserName(state, action: PayloadAction<IUserName>) {
        state.name = action.payload.name;
    },
    addError(state, action: PayloadAction<IUserError> ){
      state.error = action.payload.error;
      state.errorText = action.payload.errorText;
    },
    addUserIndex(state, action: PayloadAction<IUserIndex>) {
      state.index = action.payload.index;
    },
    addIdGame(state, action: PayloadAction<IIdGame>) {
      state.idGames.push(action.payload.idGame);
    },
    changeCurrentPlayer(state, action: PayloadAction<ICurrentPlayer>){
      state.isCurrentPlayer=action.payload.isCurrentPlayer;
    },
    setWinner(state, action: PayloadAction<IWinner>){
      state.winner=action.payload.winner;
    }
  },
});

const { actions, reducer } = userReduser;

export const {addUserName,addUserIndex,addIdGame,changeCurrentPlayer,setWinner, addError } = actions;

export default reducer;