import {connection} from "websocket";
import {IClient, IShip, IPlayer, IVector, IMessage} from '../dto';
import {BotController} from "./botController";
import {IPlayerController} from "./IPlayerController";
import {PlayerController} from "./playerController";
import RandomShips from "./random/RandomShipsServer";
import RandomShipsServer from "./random/RandomShipsServer";
import {ShipsCount} from "../../../client/src/reducer/shipsReducer";

const botShip: IShip[] = [{
	position: {x: 0, y: 0},
	direction: true,
	length: 3,
	type: 'small'
},
	{
		position: {x: 4, y: 4},
		direction: true,
		length: 2,
		type: 'small'
	},
	{
		position: {x: 7, y: 7},
		direction: false,
		length: 1,
		type: 'small'
	}]

export class Game {
	users: IClient[] = [];
	id: string;
	players: IPlayer[] = [];
	playerControllers = new Map<number, IPlayerController>()
	currentPlayer = 0;
	size = 0;
	onFinishGame:(winPlayer: number)=>void;

	constructor(users: IClient[], id: string, finishGame:(connection?:connection)=>void) {
		this.users = users;
		this.id = id;
		this.users.forEach((c, ind) => {
			const player = new PlayerController(ind, (position, status, isChangeCurrent) => this.sendMessageAttack(position, status, isChangeCurrent), (id) => this.finishGame(id), c.connection);
			this.playerControllers.set(ind, player);
			this.sendMessage(c.connection, "create_game", JSON.stringify({idGame: id, idPlayer: ind}));
		})
		this.onFinishGame = (winPlayer)=>{
			if(this.users[winPlayer]){
				finishGame(this.users[winPlayer].connection);	
			}
			
		}
	}

	isPlayer(connection: connection) {
		return this.users.find(it => it.connection === connection);
	}

	disconnect(connection: connection) {
		this.users.forEach(it => {
			if (it.connection !== connection) {
				this.sendMessage(it.connection, 'diconnect', '');
			}
		})
	}

	addShip(ships: IShip[], indexPlayer: number) {
		const player = this.playerControllers.get(indexPlayer);
//todo why this formula
		player?.addOurShips(ships);
		const enemy = this.playerControllers.get((indexPlayer + 1) % 2);
		enemy?.addEnemyShips(ships)
		this.size++;
		if (this.size >= 2) {
			this.playerControllers.forEach(player => player.startGame());
			this.sendMessageToAll('turn', JSON.stringify({currentPlayer: this.currentPlayer}))
		}

	}

	startSingleGame(data: { board: number[][], shipsToPut: Record<string, number> }) {
		this.playerControllers.set(1, new BotController(1, (position, status, isChangeCurrent) => this.sendMessageAttack(position, status, isChangeCurrent), (id) => this.finishGame(id)));
		const ran = new RandomShipsServer(data.shipsToPut)
		const t = ran.putRandomShips(data.board);
		this.addShip(t, 1);
	}

	attack(position: IVector, indexPlayer: number) {
		if (this.currentPlayer !== indexPlayer) {
			return;
		}
		const player = this.playerControllers.get(indexPlayer);
		player?.attack(position);
	}
	
	randomAttack(indexPlayer: number){
		if (this.currentPlayer !== indexPlayer) {
			return;
		}
		const player = this.playerControllers.get(indexPlayer);
		player?.randomAttack();
	}

	finishGame(winPlayer: number) {
		this.sendMessageToAll('finish', JSON.stringify({winPlayer: winPlayer}))
		this.onFinishGame(winPlayer)
	}

	sendMessageAttack(position: IVector, status: string, isChangeCurrentPlayer: boolean = false) {
		this.sendMessageToAll('attack', JSON.stringify({position, currentPlayer: this.currentPlayer, status}))

		if (isChangeCurrentPlayer) {
			this.currentPlayer = (this.currentPlayer + 1) % 2;
			const player = this.playerControllers.get(this.currentPlayer);
			player?.nextRound();
		}
		this.sendMessageToAll('turn', JSON.stringify({currentPlayer: this.currentPlayer}))
	}

	sendMessageToAll(message: string, data: string) {
		this.users.forEach((user) => {
			this.sendMessage(user.connection, message, data);
		});
	}

	sendMessage(client: connection, message: string, data: string) {
		const responseObj: IMessage = {
			type: message,
			data,
			id: 0
		}
		client.sendUTF(JSON.stringify(responseObj));
	}

}