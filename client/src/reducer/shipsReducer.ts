import {tShipCanvas} from "../components/chooseShip/CanvasSection";
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
				console.log(state,'THIS')
			// console.log(action.payload)
		// 	if(!state.activeShip)return
		// 	console.log(state.shipsToPut[`${state.activeShip}`]-1,'PUTT')
		// 	//const elValue=state.shipsToPut[`${state.activeShip}`]
		// 	// @ts-ignore
		 state.shipsOnCanvas.push(ship)
		// 	console.log(state.shipsOnCanvas,'ONCANV')
		// 	state.shipsToPut[`${state.activeShip}`]=state.shipsToPut[`${state.activeShip}`]-1
		},
		isRotateShip(state){
			state.isRotate=!state.isRotate
		},
		setActiveShip(state,action:PayloadAction<string>){
			state.activeShip=action.payload
		},
		setAutoPut(state){
			state.isAutoPut=true
		}
	},
});

const { actions, reducer } = shipsReducer;

export const {isRotateShip,addShip,setActiveShip,setAutoPut} = actions;

export default reducer;