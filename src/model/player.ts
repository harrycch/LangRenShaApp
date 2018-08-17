import { Card } from './card';

export class Player {
	public isAlive : boolean = true;
	public card : Card;

  constructor(public id : number) {
  }

  setNewCard(card : Card) : Player{
  	this.card = card;
  	return this;
  }
}