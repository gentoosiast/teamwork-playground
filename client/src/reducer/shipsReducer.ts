import {tShipCanvas} from "../dto";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
export enum ShipsCount {
	huge = 1,
	large,
	medium,
	small
}
export interface IShipsStore {
	shipsData: IShipsInitialState;
}
export interface IShipsInitialState {
	shipsOnCanvas:tShipCanvas[],
	activeShip:string
	isRotate:boolean,
	shipsToPut:Record<string, number>,
	isAutoPut:boolean
}
const initialState:IShipsInitialState = {
	activeShip:null,
	isRotate:false,
	shipsOnCanvas:[],
	shipsToPut:{
		huge: ShipsCount["huge"],
		large: ShipsCount["large"],
		medium: ShipsCount["medium"],
		small: ShipsCount["small"]
	},
	isAutoPut:false
};
const shipsReducer = createSlice({
	name: "shipsData",
	initialState,
	reducers: {
		addShip(state, action: PayloadAction<{ ship:string,active:string }>) {
			const ship=JSON.parse(action.payload.ship)
		 state.shipsOnCanvas.push(ship)
		},
		isRotateShip(state){
			state.isRotate=!state.isRotate
		},
		setActiveShip(state,action:PayloadAction<string>){
			state.activeShip=action.payload
		},
		setAutoPut(state){
			state.isAutoPut=true
		},
		setDecShip(state,action:PayloadAction<string>){
			state.shipsToPut[action.payload]=state.shipsToPut[action.payload]-1
		},
		randomRotate(state,action:PayloadAction<boolean>){
			state.isRotate=action.payload
	//		console.log("--------stateRot",state.isRotate)
		}
	},
});

const { actions, reducer } = shipsReducer;

export const {isRotateShip,addShip,setActiveShip,setAutoPut,setDecShip,randomRotate} = actions;

export default reducer;