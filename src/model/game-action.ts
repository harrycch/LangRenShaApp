import {Player} from './player';

export enum ActionType{
	WolfKill,
	WolfBurst,
	FortunetellerCheck,
	WitchPotion,
	WitchPoison,
	HunterShoot,
	StupidShow,
	PoliceElected,
	PlayerVoted
}

export class GameAction {
	public isProcessed: boolean = false;

	public constructor(public round: number, public actionType: ActionType, public targetPlayer: Player | boolean) {
	}
}