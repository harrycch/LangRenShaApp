import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Game, GameTime, GameTurn } from '../../model/game';
import { Player } from '../../model/player';
import { Team, CardType, WitchCard } from '../../model/card';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  private showAlertMessage = true;
  public game : Game;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private translate: TranslateService) {
    this.game = Game.getInstance({
      randomCards : true
    });

    if (this.game.isStarted && this.game.isPaused) { 
      this.game.continue();
    } else if (this.game.isStarted) { 
      this.game.proceed();
    } else {
      this.game.start();
    }
    console.log("Current Game: Round "+this.game.currentRound+" - "+this.currentCommandMsg);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

  ionViewCanLeave() {
    if(this.showAlertMessage) {
      let a : any = {};

      this.translate.get('alert_game_quit_title').subscribe(t => {a.title=t});
      this.translate.get('alert_game_quit_msg').subscribe(t => {a.msg=t});
      this.translate.get('alert_yes').subscribe(t => {a.yes=t});
      this.translate.get('alert_no').subscribe(t => {a.no=t});

      let alertPopup = this.alertCtrl.create({
        title: a.title,
        message: a.msg,
        buttons: [{
          text: a.yes,
          handler: () => {
            alertPopup.dismiss().then(() => {
              this.exitPage();
            });
            return false;
          }
        },
        {
          text: a.no,
          handler: () => {
            // do nothing
          }
        }]
      });

      // Show the alert
      alertPopup.present();

      // Return false to avoid the page to be popped up
      return false;
    }
  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.pop();
  }

  get currentTimeMsg() : string {
    switch (this.game.currentTurn) {
          
      case GameTurn.Wolf:
        if(this.game.killedPlayer == undefined){
          return 'command_go_to_night';
        }else {
          return '';
        }
      
      case GameTurn.PoliceElection:
        if (this.game.isInitialRound && this.game.policePlayer == undefined) {
          return 'command_go_to_day';
        }else {
          return '';
        }

      case GameTurn.Vote:
        if (!this.game.isInitialRound && this.game.votedPlayer == undefined) {
          return 'command_go_to_day';
        }else {
          return '';
        }

      default:
        return '';
    }
  }

  get currentAnnouncementMsg() : string {

    switch (this.game.currentTurn) {
      
      case GameTurn.PoliceElection:
      if (this.game.policePlayer != undefined) {
        if(this.game.policePlayer instanceof Player){
          return 'command_police_election_done';
        }else{
          return 'command_police_election_none';
        }
      }
      break;

      case GameTurn.Vote:
        if(this.game.votedPlayer == undefined){
          if (this.game.numOfDeadThisNight > 0) { 
            return 'command_announce_dead';
          } else {
            return 'command_announce_no_dead';
          }
        }
      
      default:
        return '';
    }
  }

  get currentCommandMsg() : string {
    if (this.game.isEnded) {
      return 'command_end_game';
    }

    switch (this.game.currentTurn) {
      
      case GameTurn.Wolf:
        if(this.game.killedPlayer == undefined){
          return 'command_wolf_kill';
        }else {
          return 'command_wolf_kill_end';
        }

      case GameTurn.Fortuneteller:
        if(this.game.checkedPlayer == undefined){
          return 'command_fortuneteller_check';
        }else {
          if (this.game.checkedPlayer instanceof Player) {
            if(this.game.checkedPlayer.card.team != Team.Wolf){
              return 'command_fortuneteller_check_good'
            }else{
              return 'command_fortuneteller_check_bad';
            }
          }else {
            return 'command_fortuneteller_check_none'
          }

          // return 'command_fortuneteller_check_end';
        }
      
      case GameTurn.Witch:
        if(this.game.potionedPlayer == undefined){
          let witch : Player = this.game.getPlayersByCard(CardType.Witch)[0];
          let witchCard : WitchCard = witch.card as WitchCard;
          if (witchCard.isPotionUsed) {
            return 'command_witch_potion_used';
          }else {
            if (this.game.killedPlayer instanceof Player) {
              return 'command_witch_potion';
            }else{
              return 'command_witch_potion_none';
            }
          }
        }else if(this.game.poisonedPlayer == undefined) {
          return 'command_witch_poison';
        }else{
          return 'command_witch_poison_end';
        }
      
      case GameTurn.Hunter:
        if(!this.game.isHunterNotified){
          if (this.game.poisonedPlayer instanceof Player) {
            let hunter : Player = this.game.getPlayersByCard(CardType.Hunter)[0];
            if (this.game.poisonedPlayer.id == hunter.id) { 
              return 'command_hunter_poison_no';
            } else {
              return 'command_hunter_poison_no';
            }
          }else {
            return 'command_hunter_poison_none';
          }
        }else {
          return 'command_hunter_poison_end';
        }
      
      case GameTurn.PoliceElection:
        if(this.game.policePlayer == undefined){
          return 'command_police_election';
        }else{
          return 'command_police_election_end';
        }
        // else if(this.game.policePlayer == false){
        //   return 'command_police_election_none';
        // }else{
        //   return 'command_police_election_done';
        // }
      
      case GameTurn.Vote:
        if(this.game.votedPlayer == undefined){
          if (this.game.policePlayer == false) {
            return 'command_vote_without_police';  
          }else{
            if (this.game.numOfDeadThisNight == 1){
              return 'command_vote_with_police_1dead';
            }else{
              return 'command_vote_with_police_ndead'; // include case for 0 death
            }
          }
        }else {
          if (this.game.votedPlayer instanceof Player) {
            return 'command_vote_end';
          }else{
            return 'command_vote_end_none';
          }
        }
      
      default:
        break;
    }
  }

  get currentMsgParams() : object {
    if (this.game.isEnded) {
      let params = {};
      this.translate.get(this.game.allDeadTeam == Team.Wolf ? 'team_villager_god' : 'team_wolf')
        .subscribe(t => {params.team=t});
      return params;
    }

    switch (this.game.currentTurn) {
      
      case GameTurn.Wolf:
        return {};

      case GameTurn.Fortuneteller:
        return {};
      
      case GameTurn.Witch:
        if(this.game.potionedPlayer == undefined){
          // return 'command_witch_potion';
          if (this.game.killedPlayer instanceof Player) {
            return {id: this.game.killedPlayer.id};  
          }else{
            return {};
          }
        }else if(this.game.poisonedPlayer == undefined) {
          return {};// return 'command_witch_poison';
        }else{
          return {};// return 'command_witch_poison_end';
        }
      
      case GameTurn.Hunter:
        return {};
      
      case GameTurn.PoliceElection:
        if(this.game.policePlayer == undefined){
          return {};// return 'command_police_election';
        }else if(this.game.policePlayer instanceof Player){
          return {id: this.game.policePlayer.id};
        }else{
          return {};
        }
      
      case GameTurn.Vote:
        if(this.game.votedPlayer == undefined){
          let params = {};
          if (this.game.numOfDeadThisNight > 0) { 
            params['ids'] = this.game.deadIdsThisNight;
          }
          if (this.game.policePlayer == false) {
            // let index : number = Math.floor(Math.random() * this.game.alivePlayerList.length);
            // params['id'] = this.game.alivePlayerList[index].id;
            //// the above statements will lead to ExpressionChangedAfterItHasBeenCheckedError
            params['id'] = this.game.alivePlayerList[0].id;
          }
          return params;
        }else {
          if (this.game.votedPlayer instanceof Player) {
            return {id: this.game.votedPlayer.id};// return 'command_vote_end';
          }else{
            return {};
          }
        }
      
      default:
        return {};
    }
  }

  onClickProceed(event){
    this.game.proceed();
  }

  onClickCard(event, id){
    this.game.proceed(id);
  }
}
