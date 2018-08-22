import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  gamePage: GamePage;

  constructor(public navCtrl: NavController) {

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
    this.navCtrl.push(GamePage, {
      isContinue: true
    }, {
      // animate: false
      animation: 'wp-transition'
    });
  }
}
