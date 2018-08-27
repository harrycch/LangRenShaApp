import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { Game } from '../../model/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  gamePage: GamePage;
  isPreviousGameExist: boolean;

  constructor(public navCtrl: NavController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  ionViewWillEnter(){
    this.isPreviousGameExist = Game.hasInstance();
  }

  onStartGameClick(){
    this.navCtrl.push(GamePage, {
      isContinue: false
    }, {
      // animate: false
      animation: 'wp-transition'
    });
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
