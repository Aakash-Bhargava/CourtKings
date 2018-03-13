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
  private team: TeamDetail;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private teamProvider: TeamProvider,
  ) {
    this.teamProvider.getTeamById(this.navParams.get('id'))
      .subscribe((team: TeamDetail) => this.team = team);
  }

  getTotalCoins(team: TeamDetail): number {
    return team.players.reduce((acc, player) => acc + player.coins, 0);
  }

  openPendingChallenges() {
    const challenges = this.team.challenges.filter(c => moment(c.gameTime) > moment());
    this.navCtrl.push('PendingChallengesPage', { challenges });
  }

  openFinishedChallenges() {
    const challenges = this.team.challenges.filter(c => moment(c.gameTime) < moment());
    this.navCtrl.push('FinishedChallengesPage', { challenges });
  }

  goback() {
    this.navCtrl.pop();
  }
}
