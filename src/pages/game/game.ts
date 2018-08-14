import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

  ionViewCanLeave() {
    if(this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: '暂停游戏',
        message: '想离开游戏吗？',
        buttons: [{
          text: '是',
          handler: () => {
            alertPopup.dismiss().then(() => {
              this.exitPage();
            });
            return false;
          }
        },
        {
          text: '否',
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
