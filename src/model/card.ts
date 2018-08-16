export enum Team {Wolf, Villager, God};
export enum CardType {Wolf, Villager, Fortuneteller, Witch, Hunter, Stupid};

export abstract class Card {
	public name : string;
	public team : Team;
	public type : CardType;
	public imgPath : string;

	static allTypes() : Array<CardType>{
		const keys = Object.keys(CardType).filter(k => typeof CardType[k as any] === "number"); // ["A", "B"]
		const values = keys.map(k => +CardType[k as any]); // [0, 1]

		return values;
	}

	static createCard(cardType : CardType) : Card{
		switch (+cardType) {
			case CardType.Wolf:
				return new WolfCard();
			case CardType.Villager:
				return new VillagerCard();
			case CardType.Fortuneteller:
				return new FortunetellerCard();
			case CardType.Witch:
				return new WitchCard();
			case CardType.Hunter:
				return new HunterCard();
			case CardType.Stupid:
				return new StupidCard();
			default:
				return new VillagerCard();
		}
	}
}

export class WolfCard extends Card{
	constructor (){
		super();
		this.type = CardType.Wolf;
		this.team = Team.Wolf;
		this.imgPath = 'card-wolf.jpg';
		this.name = 'card_wolf';
	}
}

export class FortunetellerCard extends Card{
	constructor (){
		super();
		this.type = CardType.Fortuneteller;
		this.team = Team.God;
		this.imgPath = 'card-fortuneteller.jpg';
		this.name = 'card_fortuneteller';
	}
}

export class WitchCard extends Card{
	public isPotionUsed :boolean = false;
	public isPoisonUsed :boolean = false;
	
	constructor (){
		super();
		this.type = CardType.Witch;
		this.team = Team.God;
		this.imgPath = 'card-witch.jpg';
		this.name = 'card_witch';
	}
}

export class HunterCard extends Card{
	constructor (){
		super();
		this.type = CardType.Hunter;
		this.team = Team.God;
		this.imgPath = 'card-hunter.jpg';
		this.name = 'card_hunter';
	}
}

export class StupidCard extends Card{
	public isShowedUp : boolean = false;
	constructor (){
		super();
		this.type = CardType.Stupid;
		this.team = Team.God;
		this.imgPath = 'card-stupid.jpg';
		this.name = 'card_stupid';
	}
}

export class VillagerCard extends Card{
	constructor (){
		super();
		this.type = CardType.Villager;
		this.team = Team.Villager;
		this.imgPath = 'card-villager.jpg';
		this.name = 'card_villager';
	}
}