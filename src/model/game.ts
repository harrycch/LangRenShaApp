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

export enum GameTime{
  Day,
  Night
}

export class Game {
  public static MIN_PLAYER_COUNT = 8;

	private static instance: Game;
	public playerList : Array<Player> = [];
	public playerCount : number = 12;
	public currentRound : number;
	private _currentTurn : GameTurn;
  public previousTurn : GameTurn;
  public isStarted : boolean = false;
  public isPaused : boolean = false;
  public isEnded : boolean = false;
  public allDeadTeam : Team;

  public policePlayer? : Player | boolean;
  public killedPlayer? : Player | boolean;
  public checkedPlayer? : Player | boolean;
  public potionedPlayer? : Player | boolean;
  public poisonedPlayer? : Player | boolean;
  public votedPlayer? : Player | boolean;
  public isHunterNotified : boolean = false;
  public deadIdsThisNight : number[] = []

  private constructor(private opts : object) {
    if (opts.hasOwnProperty('playerCount') && typeof opts['playerCount'] == 'number' && opts['playerCount'] >= Game.MIN_PLAYER_COUNT) {
      this.playerCount = opts['playerCount'];
    }

    this.generatePlayerList();

    if(opts.hasOwnProperty('randomCards') && typeof opts['randomCards'] == 'boolean' && opts['randomCards'] ){
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

  public get isInitialRound() : boolean {
    return (this.currentRound == 1);
  }

  public get numOfDeadThisNight() : number {
    return this.deadIdsThisNight.length;
  }

  public get alivePlayerList() : Array<Player> {
    return this.playerList.filter(player => player.isAlive === true);
  }

  public get previousTime() : GameTime{
    return this.getTimeFromTurn(this.previousTurn);
  }

  public get time() : GameTime{
    return this.getTimeFromTurn(this.currentTurn);
  }

  public get isTimeChanged() : boolean {
    return this.time != this.previousTime;
  }

  public get currentTurn() : GameTurn {
    return this._currentTurn;
  }

  public set currentTurn(turn : GameTurn) {
    this.previousTurn = this._currentTurn;
    this._currentTurn = turn;
  }

  getTimeFromTurn(turn: GameTurn) : GameTime{
    if (turn in [
      GameTurn.Wolf,
      GameTurn.Fortuneteller,
      GameTurn.Witch,
      GameTurn.Hunter,
      GameTurn.Stupid
      ]) { 
      return GameTime.Night;
    } else {
      return GameTime.Day;
    }
  }

  generatePlayerList(){
  	this.playerList = [];
  	for (let id = 1; id <= this.playerCount; ++id) {
  		this.playerList.push((new Player(id)).setNewCard(new VillagerCard()));
  	}
  }

  getPlayersByCard(cardType: CardType) : Array<Player>{
    return this.playerList.filter(player => player.card.type === cardType);
  }

  getAlivePlayerById(id : number) : Player {
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
    this.isStarted = true;
  }

  pause(){
    this.isPaused = true;
  }

  continue(){
    this.isPaused = false;
  }

  proceed(targetId? : number){
    if (this.isEnded) {
      return;
    }

  	switch (this.currentTurn) {
  		
      case GameTurn.Wolf:
        if(this.killedPlayer == undefined){
          if(targetId != undefined){
            this.killedPlayer = this.getAlivePlayerById(targetId);
          }else {
            this.killedPlayer = false;
          }
        }else {
          this.currentTurn = GameTurn.Fortuneteller;  
        }
  			break;

  		case GameTurn.Fortuneteller:
        if(this.checkedPlayer == undefined){
          if(targetId != undefined){
            this.checkedPlayer = this.getAlivePlayerById(targetId);
          }else {
            this.checkedPlayer = false;  
          }
        }else {
          this.currentTurn = GameTurn.Witch;
        }
  			break;
  		
      case GameTurn.Witch:
        let witchCard : WitchCard = this.getPlayersByCard(CardType.Witch)[0].card as WitchCard;
  			if(this.potionedPlayer == undefined){
          if(this.killedPlayer instanceof Player 
            && targetId == this.killedPlayer.id
            && (this.killedPlayer.card.type != CardType.Witch || this.currentRound == 1)
            && !witchCard.isPotionUsed
            ){
            this.potionedPlayer = this.killedPlayer;
          }else{
            this.potionedPlayer = false;
          }
        }else if(this.poisonedPlayer == undefined) {
          if(targetId != undefined && !witchCard.isPoisonUsed && this.potionedPlayer == false){
            this.poisonedPlayer = this.getAlivePlayerById(targetId);
          }else{
            this.poisonedPlayer = false;
          }
        }else{
          this.currentTurn = GameTurn.Hunter;
        }
  			break;
  		
      case GameTurn.Hunter:
        if(!this.isHunterNotified){
          this.isHunterNotified = true;
        }else {
          if(this.isInitialRound){
            this.currentTurn = GameTurn.PoliceElection;
          }else{
            this.processAndClearTargets();
            this.checkEndGame();
            if(!this.isEnded){
              this.currentTurn = GameTurn.Vote;  
            }
          }
        }
  			break;
      
      case GameTurn.PoliceElection:
        if(this.policePlayer == undefined){
          if(targetId != undefined){
            this.policePlayer = this.getAlivePlayerById(targetId);
          }else {
            this.policePlayer = false;
          }
        }else {
          this.processAndClearTargets();
          this.checkEndGame();
          this.currentTurn = GameTurn.Vote;
        }
        break;
      
      case GameTurn.Vote:
        if(this.votedPlayer == undefined){
          if(targetId != undefined){
            this.votedPlayer = this.getAlivePlayerById(targetId);
          }else {
            this.votedPlayer = false;
          }
        }else {
          this.processAndClearTargets();
          this.checkEndGame();
          if(!this.isEnded){
            // To next round
            this.currentRound += 1;
            this.currentTurn = GameTurn.Wolf;
            this.deadIdsThisNight = [];
          }
        }
        break;
  		
      default:
  			break;
  	}

    if (!this.isEnded) {
      this.skipUnusedCards();
    }
  }

  skipUnusedCards(){
    if(
      (this.currentTurn == GameTurn.Fortuneteller && this.getPlayersByCard(CardType.Fortuneteller).length <= 0) ||
      (this.currentTurn == GameTurn.Witch && this.getPlayersByCard(CardType.Witch).length <= 0) ||
      (this.currentTurn == GameTurn.Hunter && this.getPlayersByCard(CardType.Hunter).length <= 0) ||
      (this.currentTurn == GameTurn.Stupid && this.getPlayersByCard(CardType.Stupid).length <= 0)
      ){
      this.proceed();
    }
  }

  processAndClearTargets(){
    if(this.potionedPlayer == false && this.killedPlayer instanceof Player){
      this.killedPlayer.isAlive = false;
      this.deadIdsThisNight.push(this.killedPlayer.id);
    }

    let witchCard : WitchCard = this.getPlayersByCard(CardType.Witch)[0].card as WitchCard;
    if(this.potionedPlayer instanceof Player){
      witchCard.isPotionUsed = true;
    }

    if(this.poisonedPlayer instanceof Player){
      this.poisonedPlayer.isAlive = false;
      this.deadIdsThisNight.push(this.poisonedPlayer.id);
      witchCard.isPoisonUsed = true;
    }

    if(this.votedPlayer instanceof Player){
      if(this.votedPlayer.card.type == CardType.Stupid){
        (this.votedPlayer.card as StupidCard).isShowedUp = true;
      }else{
        this.votedPlayer.isAlive = false;
      }
    }

    this.killedPlayer = undefined;
    this.checkedPlayer = undefined;
    this.potionedPlayer = undefined;
    this.poisonedPlayer = undefined;
    this.votedPlayer = undefined;
    this.isHunterNotified = false;
  }

  checkEndGame(){
    for (let team in [Team.Wolf, Team.Villager, Team.God]) {
      if (this.getAlivePlayersByTeam(+team).length <= 0) {
        this.allDeadTeam = +team;
        this.isEnded = true;
        return;
      }
    }
  }
}