export enum Team {Wolf, Villager, God};
export enum CardType {Wolf, Villager, Fortuneteller, Witch, Hunter, Stupid};

export abstract class Card {
	public team : Team;
	public type : CardType;
}

export class WolfCard extends Card{
	constructor (){
		this.type = CardType.Wolf;
		this.team = Team.Wolf;
	}
}

export class FortunetellerCard extends Card{
	constructor (){
		this.type = CardType.Fortuneteller;
		this.team = Team.God;
	}
}

export class WitchCard extends Card{
	public isPotionUsed :boolean = false;
	public isPoisonUsed :boolean = false;
	
	constructor (){
		this.type = CardType.Witch;
		this.team = Team.God;
	}
}

export class HunterCard extends Card{
	constructor (){
		this.type = CardType.Hunter;
		this.team = Team.God;
	}
}

export class StupidCard extends Card{
	public isShowedUp : boolean = false;
	constructor (){
		this.type = CardType.Stupid;
		this.team = Team.God;
	}
}

export class VillagerCard extends Card{
	constructor (){
		this.type = CardType.Villager;
		this.team = Team.Villager;
	}
}