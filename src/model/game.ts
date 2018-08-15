import {Player} from './player';
import {Card, CardType}

export enum GameTurn { 
	Wolf,
	Fortuneteller,
	Witch,
	Hunter,
	Stupid,
	PoliceElection,
	Vote
};

export class Game {
	private static instance: Game;
	public playerList : Array<number> = [];
	public playerCount : number = 12;
	public currentRound : number;
	public currentTurn : GameTurn;
	public isInitialTurn : boolean;

  private constructor(private opts : object) {
  	generatePlayerlist();
  }

  static getInstance(opts : object) {
    if (!Game.instance) {
      Game.instance = new Game(opts);
    }
    return Game.instance;
  }

  generatePlayerList(){
  	this.playerList = [];
  	for (var id = 1; id <= playerCount; ++id) {
  		this.playerList.push((new Player(id)).setNewCard(new VillagerCard()));
  	}
  }

  getPlayerById(id : number) : Player | Undefined{
  	return this.playerList.find(player => player.id === id);
  }

  getPlayersByCard(cardType: CardType){
  	return this.playerList.filter(player => player.card.type === cardType);
  }

  start(){
  	this.currentRound = 1;
  	this.currentTurn = GameTurn.Wolf;
  	this.isInitialTurn = true;
  }

  proceed(){
  	switch (this.currentTurn) {
  		case GameTurn.Wolf:
  			this.currentTurn = GameTurn.Fortuneteller;
  			break;
  		case GameTurn.Fortuneteller:
  			this.currentTurn = GameTurn.Witch;
  			break;
  		case GameTurn.Witch:
  			this.currentTurn = GameTurn.Hunter;
  			break;
  		case GameTurn.Hunter:
  			if()
  			this.currentTurn = GameTurn.Witch;
  			break;
  		default:
  			// continue.........
  			break;
  	}
  }
}