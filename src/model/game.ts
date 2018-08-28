import {Player} from './player';
import {Card, CardType, Team, 
  WolfCard, FortunetellerCard, WitchCard, HunterCard, StupidCard, VillagerCard
} from './card';

export enum GameTurn { 
  WolfChoose,
	Wolf,
	FortunetellerChoose,
  Fortuneteller,
  WitchChoose,
	Witch,
  HunterChoose,
	Hunter,
  StupidChoose,
	Stupid,
	PoliceElection,
	Vote,
  Hunter_Kill_Shoot,
  Hunter_Vote_Shoot,
  Burst
};

export enum GameTime{
  Day,
  Night
}

export class Game {
  public static MIN_PLAYER_COUNT = 8;
  public static DEFAULT_CARD_SET = [
      CardType.Wolf,CardType.Wolf,CardType.Wolf,CardType.Wolf,
      CardType.Fortuneteller,CardType.Witch,CardType.Hunter,CardType.Stupid,
      CardType.Villager,CardType.Villager,CardType.Villager,CardType.Villager
      ];

	private static instance: Game;
  public cardSet : Array<CardType> = Game.DEFAULT_CARD_SET;
	public cardDistributed : boolean[] = [false,false,false,false,false,false,false,false,false,false,false,false];
  public playerList : Array<Player> = [];
	
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
  public shootedPlayer? : Player | boolean;
  public burstPlayer? : Player;
  public isHunterNotified : boolean = false;
  public deadIdsThisNight : number[] = [];

  private constructor(private opts : object) {
    if (opts.hasOwnProperty('cardSet') && opts['cardSet'] instanceof Array && opts['cardSet'].length >= Game.MIN_PLAYER_COUNT) {
      this.cardSet = [];
      for (let i = 0; i < opts['cardSet'].length; i++) {
        this.cardSet.push(opts['cardSet'][i]);
        this.cardDistributed.push(false);
      }
    }

    this.generatePlayerList();

    if(opts.hasOwnProperty('randomCards') && typeof opts['randomCards'] == 'boolean' && opts['randomCards'] ){
      const shuffled = this.playerList.sort(() => .5 - Math.random());// shuffle  
      for (let i = 0; i < this.playerCount; i++) {
        shuffled[i].setNewCard(Card.createCard(this.cardSet[i]));
        this.cardDistributed[i] = true;
      }
      this.playerList.sort((p1, p2) => p1.id-p2.id);
    }
  }

  static getInstance(opts : object) {
    if (!Game.instance) {
      Game.instance = new Game(opts);
    }
    return Game.instance;
  }

  static hasInstance() : boolean{
    return !!Game.instance;
  }

  static destroyInstance(){
    Game.instance = null;
  }

  public get playerCount() : number {
    return this.cardSet.length;
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

  isCardTypeAllDistributed(type : CardType) : boolean{
    return this.cardSet.findIndex((c,i) => (!this.cardDistributed[i] && c==type)) == -1;
  }

  isAllCardDistributed() : boolean{
    return this.cardSet.findIndex((c,i) => !this.cardDistributed[i]) == -1;
  }

  getTimeFromTurn(turn: GameTurn) : GameTime{
    if (turn in [
      GameTurn.WolfChoose,
      GameTurn.Wolf,
      GameTurn.FortunetellerChoose,
      GameTurn.Fortuneteller,
      GameTurn.WitchChoose,
      GameTurn.Witch,
      GameTurn.HunterChoose,
      GameTurn.Hunter,
      GameTurn.StupidChoose,
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
  		this.playerList.push(new Player(id));
  	}
  }

  getPlayersByCard(cardType: CardType) : Array<Player>{
    return this.playerList.filter(player => (player.card instanceof Card && player.card.type === cardType));
  }

  getAlivePlayerById(id : number) : Player {
  	return this.alivePlayerList.find(player => player.id === id);
  }

  getAlivePlayersByCard(cardType: CardType) : Array<Player>{
  	return this.alivePlayerList.filter(player => (player.card instanceof Card && player.card.type === cardType));
  }

  getAlivePlayersByTeam(team: Team) : Array<Player>{
    return this.alivePlayerList.filter(player => (player.card instanceof Card && player.card.team === team));
  }

  start(){
  	this.currentRound = 1;
    this.isStarted = true;
    
    if (this.isAllCardDistributed()) {
      this.currentTurn = GameTurn.Wolf;
    }else{
      this.currentTurn = GameTurn.WolfChoose;
    }
  }

  pause(){
    this.isPaused = true;
  }

  continue(){
    this.isPaused = false;
  }

  distributeCard(player: Player, type: CardType){
    player.setNewCard(Card.createCard(type));
    let index = this.cardSet.findIndex((c,i) => (!this.cardDistributed[i] && c==type));
    this.cardDistributed[index] = true;
  }

  distributeRemainingAsVillager(){
    for (var i = 0; i < this.playerList.length; i++) {
      let player = this.playerList[i];
      if (!(player.card instanceof Card)) {
        this.distributeCard(player, CardType.Villager);
      }
    }
  }

  isPlayerTargetable(player : Player) : boolean{
    switch (this.currentTurn){
      case GameTurn.WolfChoose:
      if (player.card instanceof Card) {
        return false;
      }
      break;

      case GameTurn.FortunetellerChoose:
      if (player.card instanceof Card) {
        return false;
      }
      break;

      case GameTurn.WitchChoose:
      if (player.card instanceof Card) {
        return false;
      }
      break;

      case GameTurn.HunterChoose:
      if (player.card instanceof Card) {
        return false;
      }
      break;

      case GameTurn.StupidChoose:
      if (player.card instanceof Card) {
        return false;
      }
      break;

      case GameTurn.Wolf:
      if (!player.isAlive) {
        return false;
      }
      break;

      case GameTurn.Fortuneteller:
      let fortuneteller : Player = this.getPlayersByCard(CardType.Fortuneteller)[0];
      if (!fortuneteller.isAlive) {
        return false;
      }
      if (!player.isAlive) {
        return false;
      }
      if (player.card instanceof FortunetellerCard) {
        return false;
      }
      break;

      case GameTurn.Witch:
      if (!player.isAlive) {
        return false;
      }
      if (this.getPlayersByCard(CardType.Witch).length > 0) {
        let witch : Player = this.getPlayersByCard(CardType.Witch)[0];
        let witchCard : WitchCard = witch.card as WitchCard;
        if (this.potionedPlayer == undefined) {
          if (player.card instanceof WitchCard && !this.isInitialRound) {
            return false;
          }
          if (!witch.isAlive) {
            return false;
          }
          if (witchCard.isPotionUsed) {
            return false;
          }
        }else if(this.poisonedPlayer == undefined){
          if (!witch.isAlive) {
            return false;
          }
          if (witchCard.isPoisonUsed) {
            return false;
          }
          if (this.potionedPlayer instanceof Player) {
            return false;
          }
        }
      }else{
        return false;
      }
      break;

      case GameTurn.Hunter:
      return false;

      case GameTurn.PoliceElection:
      break;

      case GameTurn.Vote:
      if (!player.isAlive) {
        return false;
      }
      break;

      case GameTurn.Hunter_Kill_Shoot:
      if (!player.isAlive) {
        return false;
      }
      break;

      case GameTurn.Hunter_Vote_Shoot:
      if (!player.isAlive) {
        return false;
      }
      break;

      case GameTurn.Burst:
      if (!(player.card.type == CardType.Wolf && player.isAlive)) {
        return false;
      }
      break;

      default:
      break;
    }

    return true;
  }

  proceed(targetId? : number){
    if (this.isEnded) {
      return;
    }

  	switch (this.currentTurn) {
      case GameTurn.WolfChoose:
        this.distributeCard(this.getAlivePlayerById(targetId), CardType.Wolf);
        if (this.isCardTypeAllDistributed(CardType.Wolf)) {
          this.currentTurn = GameTurn.Wolf;
        }
        break;
  		
      case GameTurn.Wolf:
        if(this.killedPlayer == undefined){
          if(targetId != undefined){
            this.killedPlayer = this.getAlivePlayerById(targetId);
          }else {
            this.killedPlayer = false;
          }
        }else {
          if (this.isCardTypeAllDistributed(CardType.Fortuneteller)) {
            this.currentTurn = GameTurn.Fortuneteller;  
          }else{
            this.currentTurn = GameTurn.FortunetellerChoose;
          }
        }
  			break;

      case GameTurn.FortunetellerChoose:
        this.distributeCard(this.getAlivePlayerById(targetId), CardType.Fortuneteller);
        if (this.isCardTypeAllDistributed(CardType.Fortuneteller)) {
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
          if (this.isCardTypeAllDistributed(CardType.Witch)) {
            this.currentTurn = GameTurn.Witch;
          }else{
            this.currentTurn = GameTurn.WitchChoose;
          }
        }
  			break;

      case GameTurn.WitchChoose:
        this.distributeCard(this.getAlivePlayerById(targetId), CardType.Witch);
        if (this.isCardTypeAllDistributed(CardType.Witch)) {
          this.currentTurn = GameTurn.Witch;
        }
        break;
  		
      case GameTurn.Witch:
        let witchCard : WitchCard = this.getPlayersByCard(CardType.Witch)[0].card as WitchCard;
  			if(this.potionedPlayer == undefined){
          if(this.killedPlayer instanceof Player 
            && targetId == this.killedPlayer.id
            && (this.killedPlayer.card==undefined || this.killedPlayer.card.type != CardType.Witch || this.currentRound == 1)
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
          if (this.isCardTypeAllDistributed(CardType.Hunter)) {
            this.currentTurn = GameTurn.Hunter;
          }else{
            this.currentTurn = GameTurn.HunterChoose;
          }
        }
  			break;

      case GameTurn.HunterChoose:
        this.distributeCard(this.getAlivePlayerById(targetId), CardType.Hunter);
        if (this.isCardTypeAllDistributed(CardType.Hunter)) {
          this.currentTurn = GameTurn.Hunter;
        }
        break;
  		
      case GameTurn.Hunter:
        if(!this.isHunterNotified){
          this.isHunterNotified = true;
        }else {
          if(this.policePlayer == undefined){
            if (this.isCardTypeAllDistributed(CardType.Stupid)) {
              this.currentTurn = GameTurn.PoliceElection;
            }else{
              this.currentTurn = GameTurn.StupidChoose;
            }
          }else{
            if (this.killedPlayer instanceof Player 
              && !(this.potionedPlayer instanceof Player && this.potionedPlayer.id == this.killedPlayer.id)
              && this.killedPlayer.card.type == CardType.Hunter) {
              this.currentTurn = GameTurn.Hunter_Kill_Shoot;
              this.processAndClearTargets();
            }else{
              this.processAndClearTargets();
              this.checkEndGame();
              if(!this.isEnded){
                this.currentTurn = GameTurn.Vote;  
              }
            }
          }
        }
  			break;
      
      case GameTurn.StupidChoose:
        this.distributeCard(this.getAlivePlayerById(targetId), CardType.Stupid);
        if (this.isCardTypeAllDistributed(CardType.Stupid)) {
          this.distributeRemainingAsVillager();
          this.currentTurn = GameTurn.PoliceElection;
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
          if (this.killedPlayer instanceof Player 
            && !(this.potionedPlayer instanceof Player && this.potionedPlayer.id == this.killedPlayer.id)
            && this.killedPlayer.card.type == CardType.Hunter) {
            this.currentTurn = GameTurn.Hunter_Kill_Shoot;
            this.processAndClearTargets();
          }else{
            this.processAndClearTargets();
            this.checkEndGame();
            if(!this.isEnded){
              this.currentTurn = GameTurn.Vote;  
            }
          }
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
          if (this.votedPlayer instanceof Player && this.votedPlayer.card.type == CardType.Hunter) {
            this.currentTurn = GameTurn.Hunter_Vote_Shoot;
            this.processAndClearTargets();
          }else{
            this.processAndClearTargets();
            this.checkEndGame();
            if(!this.isEnded){
              // To next round
              this.currentRound += 1;
              this.currentTurn = GameTurn.Wolf;
              this.deadIdsThisNight = [];
            }
          }
        }
        break;

      case GameTurn.Hunter_Kill_Shoot:
        if (this.shootedPlayer == undefined) {
          if (targetId != undefined) {
            this.shootedPlayer = this.getAlivePlayerById(targetId);
          }else{
            this.shootedPlayer = false;
          }
        }else{
          this.processAndClearTargets();
          this.checkEndGame();
          if(!this.isEnded){
            this.currentTurn = GameTurn.Vote;  
          }
        }
        break;

      case GameTurn.Hunter_Vote_Shoot:
        if (this.shootedPlayer == undefined) {
          if (targetId != undefined) {
            this.shootedPlayer = this.getAlivePlayerById(targetId);
          }else{
            this.shootedPlayer = false;
          }
        }else{
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

      case GameTurn.Burst:
        if (this.burstPlayer == undefined) {
          if (targetId != undefined) {
            this.burstPlayer = this.getAlivePlayerById(targetId);
          }else{
            this.currentTurn = this.previousTurn;
          }
        }else{
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

  proceedWithBurst(){
    this.currentTurn = GameTurn.Burst;
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
      if(this.votedPlayer.card.type == CardType.Stupid && !(this.votedPlayer.card as StupidCard).isShowedUp){
        (this.votedPlayer.card as StupidCard).isShowedUp = true;
      }else{
        this.votedPlayer.isAlive = false;
      }
    }

    if (this.shootedPlayer instanceof Player) {
      this.shootedPlayer.isAlive = false;
    }

    if (this.burstPlayer != undefined) {
      this.burstPlayer.isAlive = false;
    }

    this.deadIdsThisNight.sort((a,b)=> a-b);

    this.killedPlayer = undefined;
    this.checkedPlayer = undefined;
    this.potionedPlayer = undefined;
    this.poisonedPlayer = undefined;
    this.votedPlayer = undefined;
    this.shootedPlayer = undefined;
    this.burstPlayer = undefined;
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