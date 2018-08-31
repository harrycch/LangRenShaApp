import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public toastCtrl: ToastController, private translate: TranslateService) {
    
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
    this.translate.get('alert_game_start_count_placeholder').subscribe(t => {a.countPlaceholder=t});

    let alertPopup = this.alertCtrl.create({
      title: a.title,
      message: a.msg,
      inputs: [
        {
          name: 'count',
          placeholder: a.countPlaceholder,
          type: 'number'
        },
      ],
      buttons: [{
        text: a.random,
        handler: data => {
          if (data.count=="" || Game.isPlayerCountValid(+data.count)) {
            alertPopup.dismiss().then(() => {
              this.navCtrl.push(GamePage, {
                playerCount: data.count!="" ? +data.count : null,
                isContinue: false,
                randomCards: true
              }, {
                // animate: false
                animation: 'wp-transition'
              });
            });
          }else{
            this.presentErrorToast();
          }
          
          return false;
        }
      },
      {
        text: a.judge,
        handler: data => {
          if (data.count=="" || Game.isPlayerCountValid(+data.count)) {
            alertPopup.dismiss().then(() => {
              this.navCtrl.push(GamePage, {
                playerCount: data.count!="" ? +data.count : null,
                isContinue: false,
                randomCards: false
              }, {
                // animate: false
                animation: 'wp-transition'
              });
            });
          }else{
            this.presentErrorToast();
          }
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

  presentErrorToast() {
    this.translate.get('toast_game_start_count_error').subscribe(t => {
      const toast = this.toastCtrl.create({
        message: t,
        duration: 3000
      });
      toast.present();  
    });
  }
}
