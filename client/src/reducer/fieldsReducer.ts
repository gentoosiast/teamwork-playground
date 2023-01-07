import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cell, IFieldsInitialState, IVector } from "../dto";
import { emptyState } from '../utils/fieldGenerator';
const initialState:IFieldsInitialState = {
    enemyField: emptyState(),
    ourField: emptyState(),
};

interface IField {
    field: Cell[][]
}
interface IChangeField{
    position: IVector,
    status: string
}

const fieldsReducer = createSlice({
  name: "fieldsData",
  initialState,
  reducers: {
    addOurField(state, action: PayloadAction<IField>) {
        state.ourField = action.payload.field;
    },
    addEnemyField(state, action: PayloadAction<IField>) {
        state.enemyField = action.payload.field;
    },
    changeOurField(state, action: PayloadAction<IChangeField>) {
        const arr = state.ourField.slice().map((row, y) => {
            return row.map((cell, x) => {
              if (action.payload.status === 'killed') {
                return action.payload.position.x === x && action.payload.position.y === y ? Cell.Killed : cell;
              } else if (action.payload.status === 'shot') {
                return action.payload.position.x === x && action.payload.position.y === y ? Cell.Shot : cell;
              }
              return action.payload.position.x === x && action.payload.position.y === y ? Cell.Unavailable : cell;
            })
          })
        state.ourField = arr;
    },
    changeEnemyField(state, action: PayloadAction<IChangeField>) {
        const arr = state.enemyField.slice().map((row, y) => {
            return row.map((cell, x) => {
              if (action.payload.status === 'killed') {
                return action.payload.position.x === x && action.payload.position.y === y ? Cell.Killed : cell;
              } else if (action.payload.status === 'shot') {
                return action.payload.position.x === x && action.payload.position.y === y ? Cell.Shot : cell;
              }
              return action.payload.position.x === x && action.payload.position.y === y ? Cell.Unavailable : cell;
            })
          })
        state.enemyField = arr;
    },
  },
});

const { actions, reducer } = fieldsReducer;

export const {changeOurField, changeEnemyField,addOurField,addEnemyField} = actions;

export default reducer;