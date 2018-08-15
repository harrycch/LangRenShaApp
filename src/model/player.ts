import { Card } from './card';

export class Player {
	private isAlive : boolean = true;
	private card : Card;

	private isBeingKilled : boolean = false;
	private isBeingPoisoned : boolean = false;

  constructor(private id : number) {

  }
}