import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Card, CardType } from '../../model/card';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  cards: Array<Card> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    const cardTypes = Card.allTypes();
    for (var type in cardTypes) {
      let card = Card.createCard(+type);
      this.cards.push(card);
    }
  }

  cardTapped(event, card) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }
}
