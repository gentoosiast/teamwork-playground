import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Cell, IFieldsInitialState, IVector} from "../dto";
import {emptyState} from '../utils/fieldGenerator';

const initialState: IFieldsInitialState = {
	enemyField: emptyState(),
	ourField: emptyState(),
	enemyOccupiedCell: null,
	ourOccupiedCell:null
};

interface IField {
	field: Cell[][],
}

interface IChangeField {
	position: IVector,
	status: string,
	player: 'enemyField' | 'ourField';
}

const fieldsReducer = createSlice({
	name: "fieldsData",
	initialState,
	reducers: {
		addField(state, action: PayloadAction<IField>) {
			state.ourField = action.payload.field;
		},
		clearField(state){
			state.ourField = emptyState();
			state.enemyField =emptyState();
		},
		changeField(state, action: PayloadAction<IChangeField>) {
			const {player, position, status} = action.payload
			if (!state[player]) {
				state[player] = emptyState();
			}
			const arr = state[player].slice().map((row, y) => {
				return row.map((cell, x) => {
					if (status === 'killed') {
						return position.x === x && position.y === y ? Cell.Killed : cell;
					} else if (status === 'shot') {
						return position.x === x && position.y === y ? Cell.Shot : cell;
					}
					return position.x === x && position.y === y ? Cell.Unavailable : cell;
				})
			})
			if(player==='ourField'){
				state.ourOccupiedCell = {position, status}
			}else{
				state.enemyOccupiedCell = {position, status}
			}

			state[player] = arr;
		},
	},
});

const {actions, reducer} = fieldsReducer;

export const {changeField, addField,clearField} = actions;

export default reducer;