import {Player} from './player';

export class Game {
	private static instance: Game;
	private playerList : Array<number>;

  private constructor(private opts : object) {

  }

  static getInstance(opts : object) {
    if (!Game.instance) {
      Game.instance = new Game(opts);
    }
    return Game.instance;
  }
}