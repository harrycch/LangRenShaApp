import { TranslateService } from '@ngx-translate/core';
import {Game, GameTime, GameTurn} from './game';
import { Player } from './player';
import { Card, Team, CardType, WitchCard } from './card';

export class GameMessage {
	public time : string = '';
	public command : string = '';
	public announcement : string = '';
	public params : object = {};
	public requireIdInput : boolean = false;
	public negativeBtn : string = '';
	public canBurst : boolean = false;

  private constructor() {
  }

  public static generate(game: Game, translate: TranslateService) : GameMessage{
  	let msgObj = new GameMessage();

    if (game.isEnded) {
      msgObj.command = 'command_end_game';
      translate.get(game.allDeadTeam == Team.Wolf ? 'team_villager_god' : 'team_wolf')
        .subscribe(t => {msgObj.params['team']=t});
    }else{

    	if (game.isTimeChanged) {
    		if (game.time == GameTime.Day) {
    			msgObj.time = 'command_go_to_day';
    		}else{
    			msgObj.time = 'command_go_to_night';
    		}
    	}

    	switch (game.currentTurn) {
    		case GameTurn.WolfChoose:
    			msgObj.requireIdInput = true;
    			msgObj.command = 'command_choose_wolf';
    			break;

	      case GameTurn.FortunetellerChoose:
	      	msgObj.requireIdInput = true;
    			msgObj.command = 'command_choose_fortuneteller';
    			break;

    		case GameTurn.WitchChoose:
	      	msgObj.requireIdInput = true;
    			msgObj.command = 'command_choose_witch';
    			break;

    		case GameTurn.HunterChoose:
	      	msgObj.requireIdInput = true;
    			msgObj.command = 'command_choose_hunter';
    			break;

    		case GameTurn.StupidChoose:
	      	msgObj.requireIdInput = true;
    			msgObj.command = 'command_choose_stupid';
    			break;

	      case GameTurn.Wolf:
	        if(game.killedPlayer == undefined){
	          msgObj.command = 'command_wolf_kill';
	        	msgObj.requireIdInput = true;
	          msgObj.negativeBtn = 'btn_wolf_kill_negative';
	        }else {
	          msgObj.command = 'command_wolf_kill_end';
	        }
	        break;

	      case GameTurn.Fortuneteller:
	      	let fortuneteller : Player = game.getPlayersByCard(CardType.Fortuneteller)[0];
	        if(game.checkedPlayer == undefined){
	        	if (!fortuneteller.isAlive) {
	        		msgObj.command = 'command_fortuneteller_check_dead';
	        	}else {
	          	msgObj.command = 'command_fortuneteller_check';
	        		msgObj.requireIdInput = true;
	          	msgObj.negativeBtn = 'btn_fortuneteller_check_negative';
	        	}
	        }else {
	          if (game.checkedPlayer instanceof Player) {
	            if(game.checkedPlayer.card instanceof Card && game.checkedPlayer.card.team == Team.Wolf){
	              msgObj.command = 'command_fortuneteller_check_bad';
	            }else{
	              msgObj.command = 'command_fortuneteller_check_good';
	            }
	          }else {
	            msgObj.command = 'command_fortuneteller_check_none'
	          }
	        }
	        break;
	      
	      case GameTurn.Witch:
	      	if (game.getPlayersByCard(CardType.Witch).length > 0) {
	      		let witch : Player = game.getPlayersByCard(CardType.Witch)[0];
		        let witchCard : WitchCard = witch.card as WitchCard;
		        if(game.potionedPlayer == undefined){
		        	if (!witch.isAlive) {
		        		msgObj.command = 'command_witch_potion_dead';
		        	}else if (witchCard.isPotionUsed) {
		            msgObj.command =  'command_witch_potion_used';
		          }else {
		            if (game.killedPlayer instanceof Player) {
		              msgObj.command = 'command_witch_potion';
		              msgObj.params['id'] = game.killedPlayer.id;
		            	msgObj.requireIdInput = true;
		              msgObj.negativeBtn = 'btn_witch_potion_negative';
		            }else{
		              msgObj.command = 'command_witch_potion_none';
		            }
		          }
		        }else if(game.poisonedPlayer == undefined) {
		        	if(!witch.isAlive){
		        		msgObj.command = 'command_witch_poison_dead';
		        	}else if (witchCard.isPoisonUsed) {
		        		msgObj.command = 'command_witch_poison_used';	
		        	}else if (game.potionedPlayer instanceof Player){
		        		msgObj.command = 'command_witch_poison_same_round';
		        	}else{
		        		msgObj.command = 'command_witch_poison';
		        		msgObj.requireIdInput = true;
		          	msgObj.negativeBtn = 'btn_witch_poison_negative';
		        	}
		        }else{
		          msgObj.command = 'command_witch_poison_end';
		        }
	      	}else{
	      		msgObj.command = 'command_no_witch';
	      	}
	        break;
	      
	      case GameTurn.Hunter:
	        if(!game.isHunterNotified){
	          if (game.poisonedPlayer instanceof Player) {
	            let hunter : Player = game.getPlayersByCard(CardType.Hunter)[0];
	            if (game.poisonedPlayer.id == hunter.id) { 
	              msgObj.command = 'command_hunter_poison_yes';
	            } else {
	              msgObj.command = 'command_hunter_poison_no';
	            }
	          }else {
	            msgObj.command = 'command_hunter_poison_none';
	          }
	        }else {
	          msgObj.command = 'command_hunter_poison_end';
	        }
	        break;
	      
	      case GameTurn.PoliceElection:
	        if(game.policePlayer == undefined){
	          msgObj.command = 'command_police_election';
	        	msgObj.requireIdInput = true;
	          msgObj.negativeBtn = 'btn_police_election_negative';
	          msgObj.canBurst = true;
	        }else{
	          msgObj.command = 'command_police_election_end';
	          if (game.policePlayer instanceof Player) {
	          	msgObj.announcement = 'command_police_election_done';
	          	msgObj.params['id'] = game.policePlayer.id;
	          }else{
	          	msgObj.announcement = 'command_police_election_none';
	          }
	        }
	        break;
	      
	      case GameTurn.Vote:
	        if(game.votedPlayer == undefined){
	        	msgObj.canBurst = true;
	        	
	        	if (game.previousTurn != GameTurn.Hunter_Kill_Shoot) {
	        		if (game.numOfDeadThisNight > 0) { 
		        		msgObj.announcement = 'command_announce_dead';
		            msgObj.params['ids'] = game.deadIdsThisNight;
		          }else{
		          	msgObj.announcement = 'command_announce_no_dead';
		          }	
	        	}

	          if (game.policePlayer == false) {
	            msgObj.command = 'command_vote_without_police';
	            // let index : number = Math.floor(Math.random() * game.alivePlayerList.length);
	            // params['id'] = game.alivePlayerList[index].id;
	            //// the above statements will lead to ExpressionChangedAfterItHasBeenCheckedError
	            msgObj.params['id'] = game.alivePlayerList[0].id;
	          }else{
	            if (game.numOfDeadThisNight == 1){
	              msgObj.command = 'command_vote_with_police_1dead';
	            }else{
	              msgObj.command = 'command_vote_with_police_ndead'; // include case for 0 death
	            }
	          }
	          msgObj.requireIdInput = true;
	          msgObj.negativeBtn = 'btn_vote_negative';
	        }else {
	          if (game.votedPlayer instanceof Player) {
	            msgObj.announcement = 'command_vote_end';
	            msgObj.params['id'] = game.votedPlayer.id;
	            if (game.votedPlayer.card.type == CardType.Stupid) {
	            	msgObj.command = 'command_stupid_show';
	            }
	          }else{
	            msgObj.announcement = 'command_vote_end_none';
	          }
	        }
	        break;

	      case GameTurn.Hunter_Kill_Shoot:
	      	if (game.shootedPlayer == undefined) {
	      		msgObj.announcement = 'command_announce_dead';
	      		msgObj.params['ids'] = game.deadIdsThisNight;
	          msgObj.command = 'command_hunter_shoot';
	          msgObj.requireIdInput = true;
	          msgObj.negativeBtn = 'btn_hunter_shoot_negative';
	        }else{
	          if (game.shootedPlayer instanceof Player) {
	          	msgObj.announcement = 'command_hunter_shoot_done';
	          	msgObj.params['id'] = game.shootedPlayer.id;
	          }else{
	          	msgObj.announcement = 'command_hunter_shoot_none';
	          }
	        }
	      	break;

	      case GameTurn.Hunter_Vote_Shoot:
	      	if (game.shootedPlayer == undefined) {
	          msgObj.command = 'command_hunter_shoot';
	          msgObj.requireIdInput = true;
	          msgObj.negativeBtn = 'btn_hunter_shoot_negative';
	        }else{
	          if (game.shootedPlayer instanceof Player) {
	          	msgObj.announcement = 'command_hunter_shoot_done';
	          	msgObj.params['id'] = game.shootedPlayer.id;
	          }else{
	          	msgObj.announcement = 'command_hunter_shoot_none';
	          }
	        }
	      	break;
	      
	      case GameTurn.Burst:
	      	if (game.burstPlayer == undefined) {
	      		msgObj.command = 'command_burst';
	      		msgObj.requireIdInput = true;
	      		msgObj.negativeBtn = 'btn_burst_negative';
	      	}else{
	      		msgObj.announcement = 'announce_burst_done';
	      		msgObj.params['id'] = game.burstPlayer.id;
	      	}
	      	break;

	      default:
	        break;
    	}
    }

    return msgObj;
  }

}