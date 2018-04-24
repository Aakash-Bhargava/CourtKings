import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FinishedChallengesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-challenges',
  templateUrl: 'all-challenges.html',
})
export class AllChallengesPage {

  allChallenges = <any>[];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinishedChallengesPage');
    this.user = this.navParams.get("user");
    this.getAllChallenges();
  }

  getAllChallenges(){
    for( let team of this.user.teams){
      for(let challenge of team.challenges){
        if(challenge.status !="Pending"){
          this.allChallenges.push(challenge);
        }
      }
    }
    console.log(this.allChallenges);
  }

  goback() {
    this.navCtrl.pop();
  }

}
