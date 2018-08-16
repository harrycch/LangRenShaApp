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
    this.navCtrl.push(GamePage, {}, {
      // animate: false
      animation: 'wp-transition'
    });
  }
}
