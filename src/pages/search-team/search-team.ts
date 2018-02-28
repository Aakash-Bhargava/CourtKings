import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-team',
  templateUrl: 'search-team.html',
})
export class SearchTeamPage {

  queryList: any;
  allTeams =  <any>[];
  allTeamsData = <any>[];
  q: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchTeamPage');
  }

  initializeItems(): void {
    this.queryList = this.allTeamsData;
    console.log(this.queryList);
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    this.q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!this.q) {
      this.queryList = [];
      return;
    }

    this.queryList = this.queryList.filter((v) => {
      if(v.name && this.q) {
        if (v.name.toLowerCase().indexOf(this.q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(this.q, this.queryList.length);
  }

}
