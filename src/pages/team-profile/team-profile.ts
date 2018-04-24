import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import TeamProvider from '../../providers/team/team';
import { TeamDetail } from '../../types';

@IonicPage()
@Component({
  selector: 'page-team-profile',
  templateUrl: 'team-profile.html',
})
export class TeamProfilePage {
  //private team: TeamDetail;
  team: any;
  players = <any>[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private teamProvider: TeamProvider,
  ) {
    this.team = this.navParams.get('team');
    console.log(this.team);
    this.players = [...this.team.players].reverse();
  }

  getTotalCoins(team: TeamDetail): number {
    return team.players.reduce((acc, player) => acc + player.coins, 0);
  }

  goback() {
    this.navCtrl.pop();
  }

  openChallenge() {
    this.navCtrl.push('AddGamePage', { opponent: this.team });
  }
}
