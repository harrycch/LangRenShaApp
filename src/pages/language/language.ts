import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage {
  languages: Array<object> = [
    {
      name: '繁體中文',
      code: 'zh-hk'
    },
    {
      name: '簡体中文',
      code: 'zh-cn'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,private translate: TranslateService) {
    
  }

  languageTapped(event, language) {
    this.translate.use(language['code']);
  }
}
