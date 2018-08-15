export enum Team {Wolf, Villager, God};
export enum CardType {Wolf, Villager, Fortuneteller, Witch, Hunter, Stupid};

export abstract class Card {
	public team : Team;
	public type : CardType;
	public imgPath : string;
}

export class WolfCard extends Card{
	constructor (){
		this.type = CardType.Wolf;
		this.team = Team.Wolf;
		this.imgPath = 'card-wolf.jpg';
	}
}

export class FortunetellerCard extends Card{
	constructor (){
		this.type = CardType.Fortuneteller;
		this.team = Team.God;
		this.imgPath = 'card-fortuneteller.jpg';
	}
}

export class WitchCard extends Card{
	public isPotionUsed :boolean = false;
	public isPoisonUsed :boolean = false;
	
	constructor (){
		this.type = CardType.Witch;
		this.team = Team.God;
		this.imgPath = 'card-witch.jpg';
	}
}

export class HunterCard extends Card{
	constructor (){
		this.type = CardType.Hunter;
		this.team = Team.God;
		this.imgPath = 'card-hunter.jpg';
	}
}

export class StupidCard extends Card{
	public isShowedUp : boolean = false;
	constructor (){
		this.type = CardType.Stupid;
		this.team = Team.God;
		this.imgPath = 'card-stupid.jpg';
	}
}

export class VillagerCard extends Card{
	constructor (){
		this.type = CardType.Villager;
		this.team = Team.Villager;
		this.imgPath = 'card-villager.jpg';
	}
}