import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Game } from '../../model/game';
import { CardType } from '../../model/card';
import { Player } from '../../model/player';
import { GameAction, ActionType} from '../../model/game-action';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-game-result',
  templateUrl: 'game-result.html'
})
export class GameResultPage {
	public game: Game;
	public result = {
		wolf: {ids:[]},
		fortuneteller: {ids:[]},
		witch: {ids:[]},
		hunter: {ids:[]},
		stupid: {ids:[]},
    villager: {ids:[]},
		rounds: [],
	};
    
  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
    this.game = navParams.get('game');
    this.actionsToResult();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameResultPage');
  }

  actionsToResult(){
  	this.result['wolf']['ids'] = this.game.getPlayersByCard(CardType.Wolf).map(player=> player.id);
  	this.result['fortuneteller']['ids'] = this.game.getPlayersByCard(CardType.Fortuneteller).map(player=> player.id);
  	this.result['witch']['ids'] = this.game.getPlayersByCard(CardType.Witch).map(player=> player.id);
  	this.result['hunter']['ids'] = this.game.getPlayersByCard(CardType.Hunter).map(player=> player.id);
    this.result['stupid']['ids'] = this.game.getPlayersByCard(CardType.Stupid).map(player=> player.id);
  	this.result['villager']['ids'] = this.game.getPlayersByCard(CardType.Villager).map(player=> player.id);
		  	
  	for (let round = 1; round <= this.game.currentRound; round++) {
  		let roundActions : Array<GameAction> = this.game.getActionsByRound(round);
  		let roundResult = {
  			number: round
  		};

  		for (let i = 0; i < roundActions.length; i++) {
  			let action : GameAction = roundActions[i];
  			switch (action.type) {
  				case ActionType.WolfKill:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['wolf'] = action.targetPlayer.id;
              roundResult['wolfColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.FortunetellerCheck:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['fortuneteller'] = action.targetPlayer.id;
              roundResult['fortunetellerColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.WitchPotion:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['witchUse'] = 'potion';
  						roundResult['witch'] = action.targetPlayer.id;
              roundResult['witchColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.WitchPoison:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['witchUse'] = 'poison';
  						roundResult['witch'] = action.targetPlayer.id;
              roundResult['witchColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.HunterShoot:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['hunter'] = action.targetPlayer.id;
              roundResult['hunterColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.StupidShow:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['stupid'] = action.targetPlayer.id;
              roundResult['stupidColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.PlayerVoted:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['vote'] = action.targetPlayer.id;
              roundResult['voteColor'] = action.targetPlayer.card.colorName;
  					}
  					break;

  				case ActionType.WolfBurst:
  					if (action.targetPlayer instanceof Player) {
  						roundResult['burst'] = action.targetPlayer.id;
              roundResult['burstColor'] = action.targetPlayer.card.colorName;
  					}
  					break;
  				
  				default:
  					break;
  			}
  		}

  		this.result['rounds'].push(roundResult);
  	}
  }

  onClickShareBtn(event){

  }
}
