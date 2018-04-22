import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import TeamProvider from '../../providers/team/team';
import { Challenge, Team } from '../../types';

@IonicPage()
@Component({
  selector: 'page-game-end-confirmation',
  templateUrl: 'game-end-confirmation.html',
})
export class GameEndConfirmationPage {

  challenge: Challenge = null;
  active: string = null;
  teamId: string = null;
  callback: Function = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public teamProvider: TeamProvider,
  ) {
    this.challenge = this.navParams.get('challenge');
    this.teamId = this.navParams.get('teamId');
    this.callback = this.navParams.get('callback');
  }

  vote() {
    this.teamProvider.createVote(this.challenge.id, this.active, this.teamId)
    .then(() => {
      this.callback();
      this.navCtrl.pop();
    });
  }

}
