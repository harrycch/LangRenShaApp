export enum Team {Wolf, Villager, God};
export enum CardType {Wolf, Villager, Fortuneteller, Witch, Hunter, Stupid};

export abstract class Card {
	public name : string;
	public team : Team;
	public type : CardType;
	public imgPath : string;

	static allTypes() : Array<CardType>{
		const keys = Object.keys(CardType).filter(k => typeof E[k as any] === "number"); // ["A", "B"]
		const values = keys.map(k => CardType[k as any]); // [0, 1]

		return values;
	}

	static createCard(cardType : CardType) : Card{
		switch (cardType) {
			case CardType.Wolf:
				return new WolfCard();
				break;
			case CardType.Villager:
				return new VillagerCard();
				break;
			case CardType.Fortuneteller:
				return new FortunetellerCard();
				break;
			case CardType.Witch:
				return new WitchCard();
				break;
			case CardType.Hunter:
				return new HunterCard();
				break;
			case CardType.Stupid:
				return new StupidCard();
				break;
			default:
				return new VillagerCard();
				break;
		}
	}
}

export class WolfCard extends Card{
	constructor (){
		this.type = CardType.Wolf;
		this.team = Team.Wolf;
		this.imgPath = 'card-wolf.jpg';
		this.name = 'card_wolf';
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