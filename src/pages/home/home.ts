import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { Game } from '../../model/game';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  gamePage: GamePage;
  isPreviousGameExist: boolean;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private translate: TranslateService) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    this.isPreviousGameExist = Game.hasInstance();
  }

  onStartGameClick(){
    let a : any = {};

    this.translate.get('alert_game_start_title').subscribe(t => {a.title=t});
    this.translate.get('alert_game_start_msg').subscribe(t => {a.msg=t});
    this.translate.get('alert_game_start_random').subscribe(t => {a.random=t});
    this.translate.get('alert_game_start_judge').subscribe(t => {a.judge=t});
    this.translate.get('alert_game_start_cancel').subscribe(t => {a.cancel=t});

    let alertPopup = this.alertCtrl.create({
      title: a.title,
      message: a.msg,
      buttons: [{
        text: a.random,
        handler: () => {
          alertPopup.dismiss().then(() => {
            this.navCtrl.push(GamePage, {
              isContinue: false,
              randomCards: true
            }, {
              // animate: false
              animation: 'wp-transition'
            });
          });
          return false;
        }
      },
      {
        text: a.judge,
        handler: () => {
          alertPopup.dismiss().then(() => {
            this.navCtrl.push(GamePage, {
              isContinue: false,
              randomCards: false
            }, {
              // animate: false
              animation: 'wp-transition'
            });
          });
          return false;
        }
      },
      {
        text: a.cancel,
        handler: () => {
          // do nothing
        }
      }]
    });

    // Show the alert
    alertPopup.present();
  }

  onContinueGameClick(){
    if (Game.hasInstance()) {
      this.navCtrl.push(GamePage, {
        isContinue: true
      }, {
        // animate: false
        animation: 'wp-transition'
      });  
    }
  }
}
