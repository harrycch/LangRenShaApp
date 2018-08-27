import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Game, GameTime, GameTurn } from '../../model/game';
import { GameMessage } from '../../model/game-message';
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
  public gameMessage: GameMessage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private translate: TranslateService) {
    let opts = {
      randomCards : true
    };

    if (navParams.get('isContinue')!=true) {
      Game.destroyInstance();
    }

    this.game = Game.getInstance(opts);

    if (this.game.isStarted && this.game.isPaused) { 
      this.game.continue();
    } else if (this.game.isStarted) { 
    } else {
      this.game.start();
    }

    this.refreshMessages();
    console.log("Current Game: Round "+this.game.currentRound+" - "+this.gameMessage.command);
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
    this.game.pause();
    this.showAlertMessage = false;
    this.navCtrl.pop();
  }

  onClickProceed(event){
    if (this.gameMessage.negativeBtn == '') {
      this.game.proceed();
      this.refreshMessages();
    }
  }

  onClickCard(event, player: Player){
    if (this.gameMessage.negativeBtn != '' && this.game.isPlayerTargetable(player)) {
      this.game.proceed(player.id);
      this.refreshMessages();
    }
  }

  onClickNegativeBtn(event){
    this.game.proceed();
    this.refreshMessages();
  }

  refreshMessages(){
    this.gameMessage = GameMessage.generate(this.game, this.translate);
  }
}
