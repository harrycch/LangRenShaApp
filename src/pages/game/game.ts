import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Game, GameTime, GameTurn } from '../../model/game';
import { Player } from '../../model/player';
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
    translate.setDefaultLang('zh-cn');
    this.game = Game.getInstance({
      randomCards : true
    });
    this.game.start();
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
    if (this.game.time == GameTime.Day) {
      return 'command_go_to_day';
    }else{
      return 'command_go_to_night';
    }
  }

  get currentCommandMsg() : string {
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
          return 'command_fortuneteller_check_end';
        }
      
      case GameTurn.Witch:
        if(this.game.potionedPlayer == undefined){
          return 'command_witch_potion';
        }else if(this.game.poisonedPlayer == undefined) {
          return 'command_witch_poison';
        }else{
          return 'command_witch_poison_end';
        }
      
      case GameTurn.Hunter:
        if(!this.game.isHunterNotified){
          return 'command_hunter_poison';
        }else {
          return 'command_hunter_poison_end';
        }
      
      case GameTurn.PoliceElection:
        if(this.game.policePlayer == undefined){
          return 'command_police_election';
        }else if(this.game.policePlayer == false){
          return 'command_police_election_none';
        }else{
          return 'command_police_election_done';
        }
      
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
          return 'command_vote_end';
        }
      
      default:
        break;
    }
  }

  onClickProceed(){
    this.game.proceed();
  }
}
