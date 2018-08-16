import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Game } from '../../model/game';
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
}
