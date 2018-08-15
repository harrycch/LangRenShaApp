import {Player} from './player';
import {Card, CardType, Team, 
  WolfCard, FortunetellerCard, WitchCard, HunterCard, StupidCard, VillagerCard
} from './card';

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
	public playerList : Array<Player> = [];
	public playerCount : number = 12;
	public currentRound : number;
	public currentTurn : GameTurn;
	public isInitialTurn : boolean;
  public isEnded : boolean = false;
  public allDeadTeam : Team;

  private constructor(private opts : object) {
  	this.generatePlayerList();

    if(opts.randomCards){
      const shuffled = this.playerList.sort(() => .5 - Math.random());// shuffle  
      let selected = shuffled.slice(0,8);
      selected[0].setNewCard(new WolfCard());
      selected[1].setNewCard(new WolfCard());
      selected[2].setNewCard(new WolfCard());
      selected[3].setNewCard(new WolfCard());
      selected[4].setNewCard(new FortunetellerCard());
      selected[5].setNewCard(new WitchCard());
      selected[6].setNewCard(new HunterCard());
      selected[7].setNewCard(new StupidCard());
      this.playerList.sort((p1, p2) => p1.id-p2.id);
    }
  }

  static getInstance(opts : object) {
    if (!Game.instance) {
      Game.instance = new Game(opts);
    }
    return Game.instance;
  }

  public get alivePlayerList() : Array<Player> {
    return this.playerList.filter(player => player.isAlive === true);
  }

  generatePlayerList(){
  	this.playerList = [];
  	for (var id = 1; id <= this.playerCount; ++id) {
  		this.playerList.push((new Player(id)).setNewCard(new VillagerCard()));
  	}
  }

  getAlivePlayerById(id : number) : Player | Undefined{
  	return this.alivePlayerList.find(player => player.id === id);
  }

  getAlivePlayersByCard(cardType: CardType) : Array<Player>{
  	return this.alivePlayerList.filter(player => player.card.type === cardType);
  }

  getAlivePlayersByTeam(team: Team) : Array<Player>{
    return this.alivePlayerList.filter(player => player.card.team === team);
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
  			if(this.isInitialTurn){
          this.currentTurn = GameTurn.PoliceElection;
        }else{
          this.checkEndGame();
          this.currentTurn = GameTurn.Vote;
        }
  			break;
      case GameTurn.PoliceElection:
        this.currentTurn = GameTurn.Vote;
        break;
      case GameTurn.Vote:
        this.checkEndGame();
        this.currentTurn = GameTurn.Wolf;
        break;
  		default:
  			break;
  	}
  }

  checkEndGame(){
    for (var team in [Team.Wolf, Team.Villager, Team.God]) {
      if (this.getAlivePlayersByTeam(team).length <= 0) {
        this.allDeadTeam = team;
        this.isEnded = true;
        return;
      }
    }
  }
}