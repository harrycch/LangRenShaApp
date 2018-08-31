import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Game } from '../../model/game';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-game-result',
  templateUrl: 'game-result.html'
})
export class GameResultPage {
    
  constructor(public navCtrl: NavController, private translate: TranslateService) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameResultPage');
  }

  onClickShareBtn(event){

  }
}
