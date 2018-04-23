import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PendingChallengesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-todays-challenges',
  templateUrl: 'todays-challenges.html',
})
export class TodaysChallengesPage {

  user: any;
  todaysChallenges =  <any>[];
  date = new Date();
  day: any;
  month: any;
  year: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    console.log(this.day + " " + this.month + " " + this.year);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingChallengesPage');
    this.user = this.navParams.get("user");
    this.getTodaysChallenges();
  }

  getTodaysChallenges(){
    for( let team of this.user.teams){
      for(let challenge of team.challenges){
        var date = new Date(challenge.date);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        if((challenge.status !="Pending") && (day  == this.day)
          && (month == this.month) && (year == this.year)){
          this.todaysChallenges.push(challenge);
        }
      }
    }
    console.log(this.todaysChallenges);
  }

  goback() {
    this.navCtrl.pop();
  }

}
