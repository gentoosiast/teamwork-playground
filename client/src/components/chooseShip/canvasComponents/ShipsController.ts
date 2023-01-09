import {ShipsSizes} from "../ChooseComponent";
import {tShipCanvas} from "../CanvasSection";

export default class ShipsController{
	private _activeShip: string;
	private _isRotated: boolean;
	private _shipsOnCanvas: tShipCanvas[];
	constructor() {
		this._isRotated=false
		this._activeShip=null
		this._shipsOnCanvas = []
	}

	addShipOnCanvas(imageObj:tShipCanvas){
		this._shipsOnCanvas.push(imageObj)
	}
	get isRotated(){
		return this._isRotated
	}
	get activeShip(){
		return this._activeShip
	}
	set activeShip(ship){
		this._activeShip = ship
	}
	rotateShip(){
		this._isRotated=!this._isRotated
	}
	get activeShipSize(){
		return ShipsSizes[this._activeShip as keyof typeof ShipsSizes]
	}
	get shipsOnCanvas(){
		return this._shipsOnCanvas
	}

	fromRandomData(type: string, isRotate: boolean) {
		this.activeShip=type
		this._isRotated=isRotate
	}
}
